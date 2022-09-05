import React, { PropsWithChildren, useContext } from 'react';

export type MessageInputContextValue = {
  isThread: boolean;
  sendMessage: (text: string) => void;
  closeReply: () => void;
};

export const MessageInputContext = React.createContext<MessageInputContextValue | undefined>(
  undefined,
);

export const MessageInputContextProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: MessageInputContextValue;
}>) => (
  <MessageInputContext.Provider value={value as MessageInputContextValue}>
    {children}
  </MessageInputContext.Provider>
);

export const useMessageInputContext = (componentName?: string) => {
  const contextValue = useContext(MessageInputContext);

  if (!contextValue) {
    console.warn(
      `The useMessageInputContext hook was called outside of the MessageInputContext provider. Make sure this hook is called within the MessageInput's UI component. The errored call is located in the ${componentName} component.`,
    );

    return {} as MessageInputContextValue;
  }

  return contextValue as MessageInputContextValue;
};
