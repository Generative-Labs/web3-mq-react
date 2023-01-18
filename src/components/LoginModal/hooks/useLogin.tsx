import { useState } from 'react';
import { Client, WalletType, signWithQrCode, getMainKeypairSignContent, qrCodeLogin} from 'web3-mq';

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
const useLogin = (keys?: MainKeysType, account?: UserAccountType) => {
  const [userAccount, setUserAccount] = useState<UserAccountType | undefined>(account);
  const [mainKeys, setMainKeys] = useState<MainKeysType | undefined>(keys);
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
  const loginByQrCode = async (password: string) => {
    if (!userAccount) {
      return null;
    }
    if (!mainKeys || mainKeys.walletAddress.toLowerCase() !== userAccount.address.toLowerCase()) {
      console.log('主密钥对校验失败  获取主密钥对');
      const signContent = await getMainKeypairSignContent({
        password,
        did_value: userAccount.address,
        did_type: userAccount.walletType,
      });
      console.log(signContent, 'signContent');
      console.log(userAccount.address, 'userAccount.address');
      await signWithQrCode(signContent, userAccount.address.toLowerCase());
      return 'get main keys';
    } else {
      //  已经有正确的主密钥对
      console.log('已经有正确的主密钥对');
      const res = await qrCodeLogin({
        password,
        userid: userAccount.userid,
        did_type: userAccount.walletType,
        did_value: userAccount.address,
        mainPublicKey: mainKeys.publicKey,
        mainPrivateKey: mainKeys.privateKey,
      });
      console.log(res);
    }
    return 'ok';
  };
  return {
    login,
    getUserAccount,
    register,
    setUserAccount,
    userAccount,
    loginByQrCode,
    setMainKeys,
  };
};

export default useLogin;
