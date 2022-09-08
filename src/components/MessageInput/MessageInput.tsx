import React, { PropsWithChildren, useCallback, useMemo } from 'react';

import { ComponentContextValue, useComponentContext } from '../../context/ComponentContext';
import { useChannelActionContext } from '../../context/ChannelActionContext';
import { useChannelStateContext } from '../../context/ChannelStateContext';
import {
  MessageInputContextProvider,
  MessageInputContextValue,
} from '../../context/MessageInputContext';
import { useChatContext } from '../../context/ChatContext';

export type MessageInputProps = {
  isThread?: boolean;
  Input?: ComponentContextValue['Input'];
};

export const MessageInput = (props: PropsWithChildren<MessageInputProps>) => {
  const { Input: propInput, isThread = false } = props;
  const { Input: contextInput } = useComponentContext('Input');
  const { replyMsgInfo } = useChannelStateContext('ChatAutoComplete');
  const { closeReply } = useChannelActionContext('Input');
  const MessageInputUIComponent = propInput || contextInput;

  const { client } = useChatContext('MessageInput');

  const sendMessage = useCallback(
    (text: string) => {
      console.log(text);
      // client.messages.sendMessage(text, isThread, !isThread ? replyMsgInfo : null);
      replyMsgInfo && !isThread && closeReply();
    },
    [replyMsgInfo, isThread],
  );

  const messageInputContextValue: MessageInputContextValue = useMemo(
    () => ({
      isThread,
      sendMessage,
      closeReply,
    }),
    [replyMsgInfo],
  );

  return (
    <MessageInputContextProvider value={messageInputContextValue}>
      <MessageInputUIComponent />
    </MessageInputContextProvider>
  );
};
