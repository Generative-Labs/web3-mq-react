import React, { Dispatch, PropsWithChildren, SetStateAction, useContext } from 'react';
import type { WalletType } from 'web3-mq';
import type {
  LoginEventDataType,
  LoginResType,
  RegisterResType,
  UserAccountType,
} from '../components/LoginModal/hooks/useLogin';

export enum StepStringEnum {
  HOME = 'home',
  VIEW_ALL = 'view_all_desktop',
  LOGIN = 'login',
  QR_CODE = 'qr_code',
  SIGN_UP = 'sign_up',
}

export type LoginContextValue = {
  login: (password: string, walletType?: WalletType) => Promise<LoginResType | null>;
  register: (password: string, walletType?: WalletType) => Promise<RegisterResType | null>;
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
  userAccount: UserAccountType | undefined;
  setMainKeys: any;
  loginByQrCode: any;
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
