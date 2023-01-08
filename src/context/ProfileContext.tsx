import React, { PropsWithChildren, useContext } from 'react';
import type { Client } from 'web3-mq';


export type ProfileContextValue = {
  client: Client;
};

export const ProfileContext = React.createContext<ProfileContextValue | undefined>(undefined);

export const ChatProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: ProfileContextValue;
}>) => (
  <ProfileContext.Provider value={value as unknown as ProfileContextValue}>
    {children}
  </ProfileContext.Provider>
);

export const useProfileContext = (componentName?: string) => {
  const contextValue = useContext(ProfileContext);

  if (!contextValue) {
    console.warn(
      `The useProfileContext hook was called outside of the ProfileContext provider. Make sure this hook is called within a child of the Chat component. The errored call is located in the ${componentName} component.`,
    );

    return {} as ProfileContextValue;
  }

  return contextValue as unknown as ProfileContextValue;
};
