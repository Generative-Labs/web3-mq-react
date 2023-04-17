import { useRef, useState } from 'react';
import type { WalletType } from '@web3mq/client';
import { AppTypeEnum, SignAuditTypeEnum } from '../../../context';
import type { DappConnect } from '@web3mq/dapp-connect';

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

// keys: for login with main keys
// account: For custom get users
const useLogin = (
  handleLoginEvent: (eventData: LoginEventDataType) => void,
  client: any,
  dappConnectClient?: DappConnect,
  keys?: MainKeysType,
  account?: UserAccountType,
  appType?: AppTypeEnum,
) => {
  const [userAccount, setUserAccount] = useState<UserAccountType | undefined>(account);
  const confirmPassword = useRef<string>('');
  const walletAddress = useRef<string>('');
  const [registerSignRes, setRegisterSignRes] = useState('');
  const [mainKeys, setMainKeys] = useState<MainKeysType | undefined>(keys);
  const signType = useRef<SignAuditTypeEnum>();
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
    // await client.dappConnectClient.sendSign({
    //   signContent,
    //   didValue: address,
    //   signType: signAuditType,
    // });
  };

  // useEffect(() => {
  //   if (!mainKeys) {
  //     return;
  //   }
  //   afterSignAndLogin();
  // }, [mainKeys, registerSignRes]);

  const loginByQrCode = async () => {
    if (!userAccount) {
      return;
    }
    if (!mainKeys || mainKeys?.walletAddress.toLowerCase() !== userAccount.address.toLowerCase()) {
      if (!confirmPassword.current) {
        return;
      }
      // setStep(StepStringEnum.LOGIN_SIGN_LOADING);
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
  };
};

export default useLogin;
