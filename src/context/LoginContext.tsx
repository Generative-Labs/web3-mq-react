import React, { PropsWithChildren, useContext } from 'react';

export type LoginContextValue = {
  login: any;
  register: any;
  getEthAccount: any;
  address: string;
  setAddress: any;
  userExits: boolean;
  setUserExits: any;
  headerTitle: string;
  setHeaderTitle: any;
  step: any;
  setStep: any;
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
