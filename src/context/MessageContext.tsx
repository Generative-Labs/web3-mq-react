import React, { PropsWithChildren, useContext } from 'react';
import type { ChannelActionContextValue } from './ChannelActionContext';
import type { MessageItem } from './ChannelStateContext';

export type MessageContextValue = {
  isThread: boolean;
  message: MessageItem;
  handleOpenThread: ChannelActionContextValue['handleOpenThread'];
  handleToReply: ChannelActionContextValue['handleToReply'];
};

export const MessageContext = React.createContext<MessageContextValue | undefined>(undefined);

export const MessageProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: MessageContextValue;
}>) => (
  <MessageContext.Provider value={value as unknown as MessageContextValue}>
    {children}
  </MessageContext.Provider>
);

export const useMessageContext = (componentName?: string) => {
  const contextValue = useContext(MessageContext);

  if (!contextValue) {
    console.warn(
      `The useMessageContext hook was called outside of the MessageContext provider. Make sure this hook is called within the Message's UI component. The errored call is located in the ${componentName} component.`,
    );

    return {} as MessageContextValue;
  }

  return contextValue as unknown as MessageContextValue;
};
