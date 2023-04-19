import React, { useRef, useState } from 'react';
import type { WalletType } from '@web3mq/client';
import { AppTypeEnum } from '../../../context';
import type { DappConnect } from '@web3mq/dapp-connect';
import SignClient from '@walletconnect/sign-client';
import type { SessionTypes } from '@walletconnect/types';
import * as encoding from '@walletconnect/encoding';
import { Web3Modal } from '@web3modal/standalone';
import { SignAuditTypeEnum } from '../../../types/enum';

export type LoginEventType = 'login' | 'register' | 'error';
export type LoginEventDataType = {
  type: LoginEventType;
  msg: string;
  data: LoginResType | RegisterResType | null;
};

export type MainKeysType = {
  publicKey: string;
  privateKey: string;
  walletAddress: string;
};

export type UserAccountType = {
  userid: string;
  address: string;
  walletType: WalletType;
  userExist: boolean;
};

export type LoginResType = {
  privateKey: string;
  publicKey: string;
  tempPrivateKey: string;
  tempPublicKey: string;
  didKey: string;
  userid: string;
  address: string;
  pubkeyExpiredTimestamp: number;
};
export type RegisterResType = {
  privateKey: string;
  publicKey: string;
  address: string;
};

type IProps = {
  client: any;
  dappConnectClient?: DappConnect;
  walletConnectClient: React.MutableRefObject<SignClient | undefined>;
  handleLoginEvent: (eventData: LoginEventDataType) => void;
  keys?: MainKeysType;
  account?: UserAccountType;
  appType?: AppTypeEnum;
  propWcSession?: SessionTypes.Struct;
};

const projectId = '1c5ee52c12a9145d5b184e06120462cc';
const relay = 'wss://relay.walletconnect.com';

const web3Modal = new Web3Modal({
  projectId,
  walletConnectVersion: 2,
  // `standaloneChains` can also be specified when calling `web3Modal.openModal(...)` later on.
  standaloneChains: ['eip155:1'],
});
const useLogin = (props: IProps) => {
  const {
    client,
    dappConnectClient,
    walletConnectClient,
    handleLoginEvent,
    keys,
    account,
    appType,
    propWcSession,
  } = props;
  const [wcSession, setWcSession] = useState<SessionTypes.Struct | undefined>(propWcSession);
  const [userAccount, setUserAccount] = useState<UserAccountType | undefined>(account);
  const confirmPassword = useRef<string>('');
  const walletAddress = useRef<string>('');
  const [registerSignRes, setRegisterSignRes] = useState('');
  const [mainKeys, setMainKeys] = useState<MainKeysType | undefined>(keys);
  const signType = useRef<SignAuditTypeEnum>();

  const _subscribeToEvents = async (_client: SignClient) => {
    if (typeof _client === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }

    _client.on('session_ping', (args) => {
      console.log('EVENT', 'session_ping', args);
    });

    _client.on('session_event', (args) => {
      console.log('EVENT', 'session_event', args);
    });

    _client.on('session_update', ({ topic, params }) => {
      console.log('EVENT', 'session_update', { topic, params });
      const { namespaces } = params;
      const _session = _client.session.get(topic);
      const updatedSession = { ..._session, namespaces };
      onSessionConnected(updatedSession);
    });

    _client.on('session_delete', () => {
      console.log('EVENT', 'session_delete');
    });
  };

  const _checkPersistedState = async (_client: SignClient) => {
    if (typeof _client === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }
    // populates existing pairings to state
    const curPairing = _client.pairing.getAll({ active: true });
    // setPairings(curPairing);
    console.log('RESTORED PAIRINGS: ', _client.pairing.getAll({ active: true }));

    if (typeof wcSession !== 'undefined') return;
    // populates (the last) existing session to state
    if (_client.session.length) {
      const lastKeyIndex = _client.session.keys.length - 1;
      const _session = _client.session.get(_client.session.keys[lastKeyIndex]);
      console.log('RESTORED SESSION:', _session);
      onSessionConnected(_session);
    }
  };

  const create = async () => {
    if (walletConnectClient.current) return;
    walletConnectClient.current = await SignClient.init({
      projectId,
      // optional parameters
      relayUrl: relay,
      metadata: {
        name: 'react component',
        description: 'react component',
        url: window.location.host,
        icons: [],
      },
    });
    await _subscribeToEvents(walletConnectClient.current);
    // await _checkPersistedState(walletConnectClient.current);
  };

  const connect = async () => {
    if (typeof walletConnectClient.current === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }
    const { uri, approval } = await walletConnectClient.current.connect({
      requiredNamespaces: {
        eip155: {
          methods: ['personal_sign'],
          chains: ['eip155:1'],
          events: ['chainChanged', 'accountsChanged'],
        },
      },
    });

    // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
    if (uri) {
      // Create a flat array of all requested chains across namespaces.
      web3Modal.openModal({ uri });
    }
    const session = await approval();
    return session;
  };

  const closeModal = () => {
    web3Modal.closeModal();
  };

  const onSessionConnected = (_session: SessionTypes.Struct) => {
    setWcSession(_session);
  };

  const sendSignByWalletConnect = async (signContent: string, address: string) => {
    // encode message (hex)
    const hexMsg = encoding.utf8ToHex(signContent, true);
    // personal_sign params
    const params = [hexMsg, address];
    // send message
    const signature = await walletConnectClient.current?.request({
      topic: wcSession?.topic as string,
      chainId: 'eip155:1',
      request: {
        method: 'personal_sign',
        params,
      },
    });
    return {
      signature,
    };
  };

  const getMainKeypairByWalletConnect = async (options: {
    password: string;
    did_value: string;
    did_type: string;
  }) => {
    const { password, did_value, did_type } = options;
    const { signContent } = await client.register.getMainKeypairSignContent({
      password: password,
      did_value,
      did_type,
    });
    const { signature } = await sendSignByWalletConnect(signContent, did_value.toLowerCase());
    const { publicKey, secretKey } = await client.register.getMainKeypairBySignature(
      signature,
      confirmPassword.current,
    );
    return { publicKey, secretKey };
  };

  const getRegisterSignContentByWalletConnect = async (options: {
    userid: string;
    mainPublicKey: string;
    didType: string;
    didValue: string;
  }) => {
    const { userid, mainPublicKey, didValue, didType } = options;
    const { signContent } = await client.register.getRegisterSignContent({
      userid,
      mainPublicKey,
      didType,
      didValue,
    });
    const { signature } = await sendSignByWalletConnect(signContent, didValue.toLowerCase());
    return {
      signature,
    };
  };

  const registerByWalletConnect = async (nickname?: string): Promise<void> => {
    if (!userAccount) {
      return;
    }
    const { address, userid, walletType } = userAccount;
    const { publicKey, secretKey } = await getMainKeypairByWalletConnect({
      password: confirmPassword.current,
      did_value: address,
      did_type: walletType,
    });
    const { signature } = await getRegisterSignContentByWalletConnect({
      userid,
      mainPublicKey: publicKey,
      didType: walletType,
      didValue: address,
    });
    await commonRegister({
      mainPublicKey: publicKey,
      mainPrivateKey: secretKey,
      userid,
      didType: walletType,
      didValue: address,
      signature: signature as string,
      nickname,
    });
  };

  const loginByWalletConnect = async () => {
    if (!userAccount) {
      return;
    }
    const { address, userid, walletType } = userAccount;
    let localMainPrivateKey = '';
    let localMainPublicKey = '';
    if (mainKeys && address.toLowerCase() === mainKeys.walletAddress.toLowerCase()) {
      localMainPrivateKey = mainKeys.privateKey;
      localMainPublicKey = mainKeys.publicKey;
    }
    if (!localMainPublicKey || !localMainPrivateKey) {
      const { publicKey, secretKey } = await getMainKeypairByWalletConnect({
        password: confirmPassword.current,
        did_value: address,
        did_type: walletType,
      });
      localMainPrivateKey = secretKey;
      localMainPublicKey = publicKey;
    }

    await commonLogin({
      mainPrivateKey: localMainPrivateKey,
      mainPublicKey: localMainPublicKey,
      userid,
      didType: walletType,
      didValue: address,
    });
  };

  const getUserAccount = async (
    didType: WalletType = 'eth',
    address?: string,
  ): Promise<{
    address: string;
    userExist: boolean;
  }> => {
    let didValue = address;
    if (!didValue) {
      const { address } = await client.register.getAccount(didType);
      didValue = address;
    }
    const { userid, userExist } = await client.register.getUserInfo({
      did_value: didValue,
      did_type: didType,
    });
    walletAddress.current = didValue as string;
    setUserAccount({
      userid,
      address: didValue as string,
      walletType: didType,
      userExist,
    });
    return {
      address: didValue as string,
      userExist,
    };
  };

  const login = async (didType: WalletType = 'eth'): Promise<void> => {
    if (!userAccount) {
      return;
    }
    const { userid, address } = userAccount;
    let localMainPrivateKey = '';
    let localMainPublicKey = '';
    if (mainKeys && address.toLowerCase() === mainKeys.walletAddress.toLowerCase()) {
      localMainPrivateKey = mainKeys.privateKey;
      localMainPublicKey = mainKeys.publicKey;
    }
    if (!localMainPublicKey || !localMainPrivateKey) {
      const { publicKey, secretKey } = await client.register.getMainKeypair({
        password: confirmPassword.current,
        did_value: address,
        did_type: didType,
      });
      localMainPrivateKey = secretKey;
      localMainPublicKey = publicKey;
    }

    await commonLogin({
      mainPrivateKey: localMainPrivateKey,
      mainPublicKey: localMainPublicKey,
      userid,
      didType,
      didValue: address,
    });
  };

  const register = async (didType: WalletType = 'eth', nickname?: string): Promise<void> => {
    if (!userAccount) {
      return;
    }
    const { address, userid } = userAccount;
    const { publicKey, secretKey } = await client.register.getMainKeypair({
      password: confirmPassword.current,
      did_value: address,
      did_type: didType,
    });
    const { signContent } = await client.register.getRegisterSignContent({
      userid,
      mainPublicKey: publicKey,
      didType,
      didValue: address,
    });
    const { sign: signRes, publicKey: did_pubkey = '' } = await client.register.sign(
      signContent,
      address,
      didType,
    );
    await commonRegister({
      mainPublicKey: publicKey,
      mainPrivateKey: secretKey,
      userid,
      didType,
      didValue: address,
      signature: signRes,
      didPubkey: did_pubkey,
      nickname,
    });
  };

  const sendGetMainKeysSign = async (signType: SignAuditTypeEnum): Promise<void> => {
    if (!userAccount) {
      return;
    }
    const { signContent } = await client.register.getMainKeypairSignContent({
      password: confirmPassword.current,
      did_value: userAccount.address,
      did_type: userAccount.walletType,
    });
    await commonSendSign(signContent, userAccount.address.toLowerCase(), signType);
  };
  const sendGetRegisterSign = async (): Promise<void> => {
    if (!userAccount) {
      return;
    }
    const { userid, address, walletType } = userAccount;
    if (!mainKeys || mainKeys.walletAddress.toLowerCase() !== address.toLowerCase()) {
      if (!confirmPassword.current) {
        return;
      }
      await sendGetMainKeysSign(SignAuditTypeEnum.GET_KEYS_FOR_REGISTER);
      return;
    }

    const { signContent } = await client.register.getRegisterSignContent({
      userid,
      mainPublicKey: mainKeys.publicKey,
      didType: walletType,
      didValue: address,
    });
    await commonSendSign(
      signContent,
      userAccount.address.toLowerCase(),
      SignAuditTypeEnum.REGISTER,
    );
  };
  const afterSignAndLogin = async () => {
    if (signType.current === SignAuditTypeEnum.GET_KEYS_FOR_LOGIN) {
      await loginByQrCode();
    }
    if (signType.current === SignAuditTypeEnum.GET_KEYS_FOR_REGISTER) {
      await sendGetRegisterSign();
    }
    if (signType.current === SignAuditTypeEnum.REGISTER && registerSignRes) {
      await registerByQrCode(registerSignRes);
    }
  };

  const commonSendSign = async (
    signContent: string,
    address: string,
    signAuditType: SignAuditTypeEnum,
  ) => {
    signType.current = signAuditType;
    await dappConnectClient?.sendSign({
      address,
      signContent,
      password: '',
      needJump: appType !== AppTypeEnum.pc,
    });
  };

  const loginByQrCode = async () => {
    if (!userAccount) {
      return;
    }
    if (!mainKeys || mainKeys?.walletAddress.toLowerCase() !== userAccount.address.toLowerCase()) {
      if (!confirmPassword.current) {
        return;
      }
      await sendGetMainKeysSign(SignAuditTypeEnum.GET_KEYS_FOR_LOGIN);
      return;
    } else {
      await commonLogin({
        mainPrivateKey: mainKeys.privateKey,
        mainPublicKey: mainKeys.publicKey,
        userid: userAccount.userid,
        didType: userAccount.walletType,
        didValue: userAccount.address,
      });
    }
  };
  const commonLogin = async (options: {
    mainPublicKey: string;
    mainPrivateKey: string;
    userid: string;
    didType: WalletType;
    didValue: string;
  }) => {
    const { didType, didValue, userid } = options;

    const { tempPrivateKey, tempPublicKey, pubkeyExpiredTimestamp, mainPrivateKey, mainPublicKey } =
      await client.register.login({
        ...options,
        password: confirmPassword.current,
      });

    handleLoginEvent({
      msg: '',
      type: 'login',
      data: {
        privateKey: mainPrivateKey,
        publicKey: mainPublicKey,
        tempPrivateKey,
        tempPublicKey,
        didKey: `${didType}:${didValue}`,
        userid: userid,
        address: didValue,
        pubkeyExpiredTimestamp,
      },
    });
  };

  const registerByQrCode = async (signature?: string): Promise<void> => {
    if (!userAccount) {
      return;
    }
    const { address, walletType, userid } = userAccount;
    if (!mainKeys || mainKeys.walletAddress.toLowerCase() !== userAccount.address.toLowerCase()) {
      if (!confirmPassword.current) {
        return;
      }
      await sendGetMainKeysSign(SignAuditTypeEnum.GET_KEYS_FOR_REGISTER);
      return;
    } else if (!signature) {
      await sendGetRegisterSign();
      return;
    } else {
      await commonRegister({
        mainPublicKey: mainKeys.publicKey,
        mainPrivateKey: mainKeys.privateKey,
        userid,
        didType: walletType,
        didValue: address,
        nickname: '',
        signature,
      });
    }
  };

  const commonRegister = async (options: {
    mainPublicKey: string;
    mainPrivateKey: string;
    userid: string;
    didType: WalletType;
    didValue: string;
    signature: string;
    didPubkey?: string;
    nickname?: string;
  }) => {
    const {
      userid,
      mainPublicKey,
      mainPrivateKey,
      signature,
      didValue,
      didType,
      didPubkey = '',
      nickname = '',
    } = options;
    await client.register.register({
      userid,
      didValue,
      mainPublicKey,
      did_pubkey: didPubkey,
      didType,
      nickname,
      avatar_url: `https://cdn.stamp.fyi/avatar/${didValue}?s=300`,
      signature,
    });
    handleLoginEvent({
      msg: '',
      type: 'register',
      data: {
        privateKey: mainPrivateKey,
        publicKey: mainPublicKey,
        address: didValue,
      },
    });
    await commonLogin({
      mainPrivateKey,
      mainPublicKey,
      didType,
      didValue,
      userid,
    });
  };

  const web3MqSignCallback = async (signature: string) => {
    if (signType.current === SignAuditTypeEnum.REGISTER) {
      setRegisterSignRes(signature);
    } else {
      // 设置主密钥对
      const { publicKey, secretKey } = await client.register.getMainKeypairBySignature(
        signature,
        confirmPassword.current,
      );
      setMainKeys({
        publicKey,
        privateKey: secretKey,
        walletAddress: walletAddress.current || userAccount?.address || '',
      });
    }
  };

  return {
    mainKeys,
    registerSignRes,
    afterSignAndLogin,
    login,
    getUserAccount,
    register,
    userAccount,
    loginByQrCode,
    setMainKeys,
    registerByQrCode,
    web3MqSignCallback,
    setUserAccount,
    confirmPassword,
    create,
    connect,
    closeModal,
    onSessionConnected,
    loginByWalletConnect,
    registerByWalletConnect,
  };
};

export default useLogin;
