import React, { useMemo } from 'react';

import { Message as DefaultMessage } from '../../Message';
import type { ComponentContextValue } from '../../../context/ComponentContext';
import type { ChannelState } from '../../../context/ChannelStateContext';

type MessageListElementsProps = {
  Message?: ComponentContextValue['Message'];
  messageList: ChannelState['messageList'];
};

export const useMessageListElements = (props: MessageListElementsProps) => {
  const { Message, messageList } = props;

  const MessageUI = Message || DefaultMessage;

  return useMemo(() => {
    if (!messageList) {
      return null;
    }
    return messageList.map((message) => {
      return (
        <li key={message.id}>
          <MessageUI message={message} {...props} />
        </li>
      );
    });
  }, [JSON.stringify(messageList)]);
};
