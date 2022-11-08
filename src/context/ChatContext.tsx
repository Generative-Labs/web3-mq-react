import React, { PropsWithChildren, useContext } from 'react';
import type { Client, SearchUsersResponse } from 'web3-mq';

export type ListComponentType = 'room' | 'chat';

export enum AppTypeEnum {
  'pc' = 'pc',
  'h5' = 'h5',
  'mobile' = 'mobile',
}

export type ChatContextValue = {
  client: Client;
  containerId: string;
  appType: AppTypeEnum;
  userInfo: SearchUsersResponse | null;
  showCreateChannel: boolean;
  showListTypeView: ListComponentType | string;
  setShowCreateChannel: React.Dispatch<React.SetStateAction<boolean>>;
  setShowListTypeView: (listType: ListComponentType | string) => void;
  logout: () => void;
};

export const ChatContext = React.createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: ChatContextValue;
}>) => (
  <ChatContext.Provider value={value as unknown as ChatContextValue}>
    {children}
  </ChatContext.Provider>
);

export const useChatContext = (componentName?: string) => {
  const contextValue = useContext(ChatContext);

  if (!contextValue) {
    console.warn(
      `The useChatContext hook was called outside of the ChatContext provider. Make sure this hook is called within a child of the Chat component. The errored call is located in the ${componentName} component.`,
    );

    return {} as ChatContextValue;
  }

  return contextValue as unknown as ChatContextValue;
};
