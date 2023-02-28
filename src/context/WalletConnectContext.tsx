import React, { PropsWithChildren, useContext } from 'react';
import type { SessionTypes } from '@walletconnect/types';

export type WalletConnectContextValue = {
  wcSession: SessionTypes.Struct | undefined,
  create: () => Promise<void>,
  connect: () => Promise<SessionTypes.Struct>,
  closeModal: () => void,
  onSessionConnected: (session: SessionTypes.Struct) => void,
  registerByWalletConnect: (nickname?: string) => Promise<void>,
  loginByWalletConnect: () => Promise<void>,
  walletConnectClient: any,
};

export const WalletConnectContext = React.createContext<WalletConnectContextValue | undefined>(undefined);

export const WalletConnectProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: WalletConnectContextValue;
}>) => (
  <WalletConnectContext.Provider value={value as unknown as WalletConnectContextValue}>
    {children}
  </WalletConnectContext.Provider>
);

export const useWalletConnectContext = (componentName?: string) => {
  const contextValue = useContext(WalletConnectContext);

  if (!contextValue) {
    console.warn(
      `The useWalletConnectContext hook was called outside of the ChatContext provider. Make sure this hook is called within a child of the Chat component. The errored call is located in the ${componentName} component.`,
    );

    return {} as WalletConnectContextValue;
  }

  return contextValue as unknown as WalletConnectContextValue;
};