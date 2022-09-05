import React, { PropsWithChildren, useMemo } from 'react';
import { useComponentContext } from '../../context/ComponentContext';
import { MessageProvider, MessageContextValue } from '../../context/MessageContext';
import { useChannelActionContext } from '../../context/ChannelActionContext';

import type { MessageItem } from '../../context/ChannelStateContext';

export type MessageProps = {
  isThread?: boolean;
  message: MessageItem;
  Message?: React.ComponentType<any>;
};

export const Message = (props: PropsWithChildren<MessageProps>) => {
  const { isThread = false, message, Message: propMessage } = props;
  const { Message: contextMessage } = useComponentContext('Message');
  const { handleOpenThread, handleToReply } = useChannelActionContext('Message');
  const MessageUIComponent = propMessage || contextMessage;

  const messageContextValue: MessageContextValue = useMemo(
    () => ({
      isThread,
      message,
      handleOpenThread,
      handleToReply
    }),
    [isThread, message],
  );

  return (
    <MessageProvider value={messageContextValue}>
      <MessageUIComponent />
    </MessageProvider>
  );
};
