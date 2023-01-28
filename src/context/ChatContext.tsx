import React, { PropsWithChildren, useContext } from 'react';
import type { Client } from '@web3mq/client';
import type {CommonUserInfoType, SearchDidType} from '../components/Chat/hooks/useQueryUserInfo';

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
  showListTypeView: ListComponentType | string;
  setShowListTypeView: (listType: ListComponentType | string) => void;
  logout: () => void;
  getUserInfo: (
      didValue: string,
      didType: SearchDidType,
  ) => Promise<CommonUserInfoType | null>;
  loginUserInfo: CommonUserInfoType | null
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
