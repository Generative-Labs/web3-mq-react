import React, { Dispatch, PropsWithChildren, SetStateAction, useContext } from 'react';
import type { WalletType } from '@web3mq/client';
import type { WalletInfoType } from './LoginContext';

export enum BindStepStringEnum {
  HOME = 'home',
  VIEW_ALL = 'view_all_desktop',
  QR_CODE = 'qr_code',
  CONNECT_LOADING = 'connect_loading',
  CONNECT_ERROR = 'connect_error',
  SIGN_LOADING = 'sign_loading',
  SIGN_ERROR = 'sign_error',
  REJECT_CONNECT = 'reject_connect',
  READY_SIGN_UP = 'ready_sign_up',


  READY_BIND = 'ready_bind',
  DID_BINDING = 'did_binding',
  DID_BIND_SUCCESS = 'did_bind_success',
  DID_BIND_ERROR = 'did_bind_error',

}

export type BindDidContextValue = {
  styles?: Record<string, any> | null;
  showLoading: boolean;
  getAccount: (walletType?: WalletType, address?: string) => Promise<any>;
  setWalletInfo: Dispatch<SetStateAction<WalletInfoType | undefined>>;
  setConnectLoadingStep: ( step: BindStepStringEnum ) => void;
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
