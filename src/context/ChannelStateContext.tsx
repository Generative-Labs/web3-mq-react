import React, { PropsWithChildren, useContext } from 'react';

export type MessageItem = any;

export type ChannelState = {
  messageList: MessageItem[] | null;
  threadList: MessageItem[] | null;
  allThreadList: MessageItem[] | null;
  message: MessageItem | null;
  replyMsgInfo: MessageItem | null;
  activeChannel: any | null;
  openAllThread: boolean;
  msgLoading: boolean;
  threadLoading: boolean;
};

export type ChannelStateContextValue = ChannelState;

export const ChannelStateContext = React.createContext<ChannelStateContextValue | undefined>(
  undefined,
);

export const ChannelStateProvider = ({
  children,
  value,
}: PropsWithChildren<{
  value: ChannelStateContextValue;
}>) => (
  <ChannelStateContext.Provider value={value as unknown as ChannelStateContextValue}>
    {children}
  </ChannelStateContext.Provider>
);

export const useChannelStateContext = (componentName?: string) => {
  const contextValue = useContext(ChannelStateContext);

  if (!contextValue) {
    console.warn(
      `The useChannelStateContext hook was called outside of the ChannelStateContext provider. Make sure this hook is called within a child of the Channel component. The errored call is located in the ${componentName} component.`,
    );

    return {} as ChannelStateContextValue;
  }

  return contextValue as unknown as ChannelStateContextValue;
};
