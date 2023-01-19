import { useEffect, useRef, useState } from 'react';
import { Client, WalletType } from 'web3-mq';
import { SignAuditTypeEnum } from '../../../context';

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
  keys?: MainKeysType,
  account?: UserAccountType,
) => {
  const [userAccount, setUserAccount] = useState<UserAccountType | undefined>(account);
  const walletAddress = useRef<string>('');
  const [registerSignRes, setRegisterSignRes] = useState('');
  const [mainKeys, setMainKeys] = useState<MainKeysType | undefined>(keys);
  const [signAuditType, setSignAuditType] = useState< SignAuditTypeEnum | undefined >();
  const getUserAccount = async (
    didType: WalletType = 'eth',
    address?: string,
  ): Promise<{
    address: string;
    userExist: boolean;
  }> => {
    let didValue = address;
    if (!didValue) {
      const { address } = await Client.register.getAccount(didType);
      didValue = address;
    }
    const { userid, userExist } = await Client.register.getUserInfo({
      did_value: didValue,
      did_type: didType,
    });
    walletAddress.current = didValue;
    setUserAccount({
      userid,
      address: didValue,
      walletType: didType,
      userExist,
    });
    return {
      address: didValue,
      userExist,
    };
  };

  const login = async (
    password: string,
    didType: WalletType = 'eth',
  ): Promise<LoginResType | null> => {
    if (!userAccount) {
      return null;
    }

    let localMainPrivateKey = '';
    let localMainPublicKey = '';
    if (mainKeys && userAccount.address.toLowerCase() === mainKeys.walletAddress.toLowerCase()) {
      localMainPrivateKey = mainKeys.privateKey;
      localMainPublicKey = mainKeys.publicKey;
    }
    const { userid, address } = userAccount;
    const { TempPrivateKey, TempPublicKey, pubkeyExpiredTimestamp, mainPrivateKey, mainPublicKey } =
      await Client.register.login({
        password,
        userid,
        did_value: address,
        did_type: didType,
        mainPublicKey: localMainPublicKey,
        mainPrivateKey: localMainPrivateKey,
      });
    return {
      privateKey: mainPrivateKey,
      publicKey: mainPublicKey,
      tempPrivateKey: TempPrivateKey,
      tempPublicKey: TempPublicKey,
      didKey: `${didType}:${address}`,
      userid,
      address,
      pubkeyExpiredTimestamp,
    };
  };

  const register = async (
    password: string,
    didType: WalletType = 'eth',
  ): Promise<RegisterResType | null> => {
    if (!userAccount) {
      return null;
    }
    const { address, userid } = userAccount;
    const { mainPrivateKey, mainPublicKey } = await Client.register.register({
      password,
      did_value: address,
      userid,
      did_type: didType,
      avatar_url: `https://cdn.stamp.fyi/avatar/${address}?s=300`,
    });
    return { privateKey: mainPrivateKey, publicKey: mainPublicKey, address };
  };

  const sendGetMainKeysSign = async (password: string, signType: SignAuditTypeEnum): Promise<void> => {
    if (!userAccount) {
      return;
    }
    const { signContent } = await Client.qrCodeSign.getMainKeypairSignContent({
      password,
      did_value: userAccount.address,
      did_type: userAccount.walletType,
    });
    await commonSendSign(signContent, userAccount.address.toLowerCase(), signType);
  };
  const sendGetRegisterSign = async (): Promise<void> => {
    if (!userAccount) {
      return;
    }
    const { signContent } = await Client.qrCodeSign.getRegisterSignContent({
      userid: userAccount.userid,
    });
    await commonSendSign(signContent, userAccount.address.toLowerCase(), SignAuditTypeEnum.REGISTER);
  };
  const afterSignAndLogin = async () => {
    if (signAuditType === SignAuditTypeEnum.GET_KEYS_FOR_LOGIN) {
      await loginByQrCode();
    }
    if (signAuditType === SignAuditTypeEnum.GET_KEYS_FOR_REGISTER) {
      await sendGetRegisterSign();
    }
    if (signAuditType === SignAuditTypeEnum.REGISTER && registerSignRes) {
      await registerByQrCode(undefined, registerSignRes);
    }
  };


  const commonSendSign = async (signContent: string, address: string, signAuditType: SignAuditTypeEnum) => {
    await Client.qrCodeSign.signWithQrCode(signContent, address, signAuditType);
  };

  useEffect(() => {
    if (!mainKeys) {
      return;
    }
    afterSignAndLogin();
  }, [mainKeys, registerSignRes, signAuditType]);

  const loginByQrCode = async (password?: string) => {
    if (!userAccount) {
      return;
    }
    if (!mainKeys || mainKeys?.walletAddress.toLowerCase() !== userAccount.address.toLowerCase()) {
      if (!password) {
        return;
      }
      await sendGetMainKeysSign(password, SignAuditTypeEnum.GET_KEYS_FOR_LOGIN);
      return;
    } else {
      const {
        TempPrivateKey,
        TempPublicKey,
        pubkeyExpiredTimestamp,
        mainPrivateKey,
        mainPublicKey,
      } = await Client.qrCodeSign.qrCodeLogin({
        userid: userAccount.userid,
        did_value: userAccount.address,
        did_type: userAccount.walletType,
        password,
        mainPrivateKey: mainKeys.privateKey,
        mainPublicKey: mainKeys.publicKey,
      });

      handleLoginEvent({
        msg: '',
        type: 'login',
        data: {
          privateKey: mainPrivateKey,
          publicKey: mainPublicKey,
          tempPrivateKey: TempPrivateKey,
          tempPublicKey: TempPublicKey,
          didKey: `${userAccount.walletType}:${userAccount.address}`,
          userid: userAccount.userid,
          address: userAccount.address,
          pubkeyExpiredTimestamp,
        },
      });
    }
  };

  const registerByQrCode = async (password?: string, signature?: string): Promise<void> => {
    if (!userAccount) {
      return;
    }
    if (!mainKeys || mainKeys.walletAddress.toLowerCase() !== userAccount.address.toLowerCase()) {
      if (!password) {
        return;
      }
      await sendGetMainKeysSign(password, SignAuditTypeEnum.GET_KEYS_FOR_REGISTER);
      return;
    } else if (!signature) {
      await sendGetRegisterSign();
      return;
    } else {
      await Client.qrCodeSign.qrCodeRegister({
        userid: userAccount.userid,
        signature,
      });
      await loginByQrCode();
    }
  };

  const web3MqSignCallback = async (signature: string, signType: SignAuditTypeEnum) => {
    setSignAuditType(signType);
    if (signType === SignAuditTypeEnum.REGISTER) {
      setRegisterSignRes(signature);
    } else {
      // 设置主密钥对
      const { publicKey, secretKey } = await Client.qrCodeSign.getMainKeypair(signature);
      setMainKeys({
        publicKey,
        privateKey: secretKey,
        walletAddress: walletAddress.current,
      });
    }
  };

  return {
    login,
    getUserAccount,
    register,
    userAccount,
    loginByQrCode,
    setMainKeys,
    registerByQrCode,
    web3MqSignCallback,
    setUserAccount,
  };
};

export default useLogin;
