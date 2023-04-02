import React, { Dispatch, PropsWithChildren, SetStateAction, useContext } from 'react';
import type { SessionTypes } from '@walletconnect/types';
import type { WalletType } from '@web3mq/client';
import type { DappConnect } from '@web3mq/dapp-connect';
import type { WalletInfoType } from './LoginContext';
import type { AppTypeEnum } from './ChatContext';
import type { UserAccountType } from '../components/LoginModal/hooks/useLogin';

export enum BindStepStringEnum {
  HOME = 'home',
  VIEW_ALL = 'view_all_desktop',
  QR_CODE = 'qr_code',
  CONNECT_LOADING = 'connect_loading',
  CONNECT_ERROR = 'connect_error',
  SIGN_LOADING = 'sign_loading',
  SIGN_ERROR = 'sign_error',
  REJECT_CONNECT = 'reject_connect',
  READY_BIND = 'ready_bind',
  READY_SIGN_UP = 'ready_sign_up',
  DID_BINDING = 'did_binding',
  DID_BIND_SUCCESS = 'did_bind_success',
  DID_BIND_ERROR = 'did_bind_error',
}

export type BindDidContextValue = {
  client: any;
  showLoading: boolean;
  step: string;
  setStep: Dispatch<SetStateAction<BindStepStringEnum>>;
  walletType: WalletType;
  setWalletType: Dispatch<SetStateAction<WalletType>>;
  handleBindDidEvent: (eventData: any) => void;
  setShowLoading: Dispatch<SetStateAction<boolean>>;
  styles?: Record<string, any> | null;
  handleWeb3mqCallback: any;
  dappConnectClient?: DappConnect;
  setDappConnectClient: Dispatch<SetStateAction<DappConnect | undefined>>;
  env: 'dev' | 'test';
  walletInfo?: WalletInfoType;
  setWalletInfo: Dispatch<SetStateAction<WalletInfoType | undefined>>;
  getAccount: (walletType?: WalletType, address?: string) => Promise<any>;
  qrCodeUrl: any;
  userAccount: UserAccountType | undefined;
  setUserAccount: Dispatch<SetStateAction<UserAccountType | undefined>>;
  wcSession: SessionTypes.Struct | undefined;
  create: () => Promise<void>;
  connect: () => Promise<SessionTypes.Struct>;
  closeModal: () => void;
  onSessionConnected: (session: SessionTypes.Struct) => void;
  walletConnectClient: any;
  sendSign: any;
  appType: AppTypeEnum;
  containerId: string;
};

export const BindDidConnectContext = React.createContext<BindDidContextValue | undefined>(
  undefined,
);

export const BindDidProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: BindDidContextValue;
}>) => (
  <BindDidConnectContext.Provider value={value as unknown as BindDidContextValue}>
    {children}
  </BindDidConnectContext.Provider>
);

export const useBindDidContext = (componentName?: string) => {
  const contextValue = useContext(BindDidConnectContext);

  if (!contextValue) {
    console.warn(
      `The useBindDidContext hook was called outside of the ChatContext provider. Make sure this hook is called within a child of the Chat component. The errored call is located in the ${componentName} component.`,
    );

    return {} as BindDidContextValue;
  }

  return contextValue as unknown as BindDidContextValue;
};
