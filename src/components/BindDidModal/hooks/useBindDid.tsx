import React, { useEffect, useRef, useState } from 'react';
import { AppTypeEnum, SignAuditTypeEnum } from '../../../context';
import type { DappConnect } from '@web3mq/dapp-connect';
import SignClient from '@walletconnect/sign-client';
import { Web3Modal } from '@web3modal/standalone';
import type { WalletType } from '@web3mq/client';
import type { SessionTypes } from '@walletconnect/types';
import * as encoding from '@walletconnect/encoding';

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

const projectId = '1c5ee52c12a9145d5b184e06120462cc';
const relay = 'wss://relay.walletconnect.com';

const web3Modal = new Web3Modal({
  projectId,
  walletConnectVersion: 2,
  // `standaloneChains` can also be specified when calling `web3Modal.openModal(...)` later on.
  standaloneChains: ['eip155:1'],
});

const useBindDid = (
  client: any,
  walletConnectClient: React.MutableRefObject<SignClient | undefined>,
  dappConnectClient?: DappConnect,
  appType?: AppTypeEnum,
) => {
  const [userAccount, setUserAccount] = useState<UserAccountType | undefined>();
  const walletAddress = useRef<string>('');
  const [wcSession, setWcSession] = useState<SessionTypes.Struct>();
  const [signRes, setSignRes] = useState('');
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
  const sendSignByDappConnect = async (signContent: string, address: string) => {
    await dappConnectClient?.sendSign({
      address,
      signContent,
      password: '',
      needJump: appType !== AppTypeEnum.pc,
    });
  };
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
    // const allNamespaceAccounts = Object.values(_session.namespaces)
    //   .map((namespace) => namespace.accounts)
    //   .flat();
    // const allNamespaceChains = Object.keys(_session.namespaces);
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
    setSignRes(signature as string);
  };

  const web3MqSignCallback = async (signature: string) => {
    setSignRes(signature);
  };

  const normalSign = async (signContent: string, address: string, walletType: WalletType) => {
    const { sign: did_signature, publicKey: did_pubkey = '' } = await client.register.sign(
      signContent,
      address,
      walletType,
    );
    setSignRes(did_signature);
  };



  return {
    sendSignByDappConnect,
    normalSign,
    create,
    connect,
    closeModal,
    sendSignByWalletConnect,
    getUserAccount,
    onSessionConnected,
    userAccount,
    web3MqSignCallback,
    setUserAccount,
    wcSession,
    signRes,
  };
};

export default useBindDid;
