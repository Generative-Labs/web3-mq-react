import React, { Dispatch, PropsWithChildren, SetStateAction, useContext } from 'react';
import type { WalletType } from '@web3mq/client';
import type { LoginEventDataType } from '../components/LoginModal/hooks/useLogin';
import type { DappConnect } from '@web3mq/dapp-connect';

export enum StepStringEnum {
  HOME = 'home',
  VIEW_ALL = 'view_all_desktop',
  LOGIN = 'login',
  QR_CODE = 'qr_code',
  SIGN_UP = 'sign_up',
  CONNECT_LOADING = 'connect_loading',
  CONNECT_ERROR = 'connect_error',
  LOGIN_SIGN_LOADING = 'login_sign_loading',
  LOGIN_SIGN_ERROR = 'login_sign_error',
  SIGN_UP_SIGN_LOADING = 'sign_up_sign_loading',
  SIGN_UP_SIGN_ERROR = 'sign_up_sign_error',
}

export enum SignAuditTypeEnum {
  GET_KEYS_FOR_LOGIN = 'get_Keys_For_Login',
  GET_KEYS_FOR_REGISTER = 'get_keys_For_Register',
  REGISTER = 'register',
}

export type LoginContextValue = {
  client: any;
  login: (walletType?: WalletType) => Promise<void>;
  register: (walletType?: WalletType) => Promise<void>;
  getAccount: (walletType?: WalletType, address?: string) => Promise<any>;
  showLoading: boolean;
  setShowLoading: Dispatch<SetStateAction<boolean>>;
  step: string;
  setStep: Dispatch<SetStateAction<StepStringEnum>>;
  walletType: WalletType;
  setWalletType: Dispatch<SetStateAction<WalletType>>;
  styles?: Record<string, any> | null;
  handleLoginEvent: (eventData: LoginEventDataType) => void;
  handleWeb3mqCallback: any;
  qrCodeUrl: any;
  userAccount: any;
  setMainKeys: any;
  loginByQrCode: any;
  registerByQrCode: any;
  confirmPassword: React.MutableRefObject<string>;
  dappConnectClient?: DappConnect;
  setDappConnectClient: Dispatch<SetStateAction<DappConnect | undefined>>;
  env: 'dev' | 'test';
  walletInfo?: WalletInfoType;
  setWalletInfo: Dispatch<SetStateAction<WalletInfoType | undefined>>;
};

export type WalletInfoType = {
  name: string;
  type: 'eth' | 'starknet' | 'web3mq';
};

export const LoginContext = React.createContext<LoginContextValue | undefined>(undefined);

export const LoginProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: LoginContextValue;
}>) => (
  <LoginContext.Provider value={value as unknown as LoginContextValue}>
    {children}
  </LoginContext.Provider>
);

export const useLoginContext = (componentName?: string) => {
  const contextValue = useContext(LoginContext);

  if (!contextValue) {
    console.warn(
      `The useChatContext hook was called outside of the ChatContext provider. Make sure this hook is called within a child of the Chat component. The errored call is located in the ${componentName} component.`,
    );

    return {} as LoginContextValue;
  }

  return contextValue as unknown as LoginContextValue;
};
