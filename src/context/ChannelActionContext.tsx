import React, { Dispatch, PropsWithChildren, useContext } from 'react';
import type { ChannelStateReducerAction } from '../components/Channel/ChannelState';

export type ChannelActionContextValue = {
  dispatch: Dispatch<ChannelStateReducerAction>;
  handleOpenThread: (message: any, event: React.BaseSyntheticEvent) => void;
  handleToReply: (message: any, event: React.BaseSyntheticEvent) => void;
  closeThread: (event: React.BaseSyntheticEvent) => void;
  handleOpenAllThread: () => void;
  closeAllThreadList: () => void;
  closeReply:() => void;
};

export const ChannelActionContext = React.createContext<ChannelActionContextValue | undefined>(
  undefined,
);

export const ChannelActionProvider = ({
  children,
  value,
}: PropsWithChildren<{ value: ChannelActionContextValue }>) => (
  <ChannelActionContext.Provider value={value as unknown as ChannelActionContextValue}>
    {children}
  </ChannelActionContext.Provider>
);

export const useChannelActionContext = (componentName?: string) => {
  const contextValue = useContext(ChannelActionContext);

  if (!contextValue) {
    console.warn(
      `The useChatContext hook was called outside of the ChannelActionContext provider. Make sure this hook is called within a child of the Chat component. The errored call is located in the ${componentName} component.`,
    );

    return {} as ChannelActionContextValue;
  }

  // return contextValue as unknown as ChannelActionContextValue;
  return contextValue as ChannelActionContextValue;
};
