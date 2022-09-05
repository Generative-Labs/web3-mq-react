import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

import { useComponentContext, ComponentContextValue } from '../../context/ComponentContext';
import { Message } from '../Message';
import { MessageList } from '../MessageList';
import { MessageInput } from '../MessageInput';
import { Window } from '../Window';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { useChannelStateContext } from '../../context/ChannelStateContext';
import { useChannelActionContext } from '../../context/ChannelActionContext';

import ss from './index.scss';

export type ThreadProps = {
  Input?: ComponentContextValue['Input'];
  Message?: ComponentContextValue['Message'];
};

const UnMemoizedThread = (props: PropsWithChildren<ThreadProps>) => {
  const { Input: PropInput, Message: PropMessage } = props;
  const { ThreadHeader } = useComponentContext('Thread');
  const { message } = useChannelStateContext('Thread');
  const { closeThread } = useChannelActionContext('Thread');
  const { appType } = useChatContext('Thread');

  const ThreadMessageList = MessageList;

  if (!message) {
    return null;
  }

  return (
    <Window className={cx(ss.threadContainer, { [ss.mobileStyle]: appType !== AppTypeEnum['pc'] })}>
      <ThreadHeader close={closeThread} title={'Thread'} appType={appType} />
      <Message isThread message={message} Message={PropMessage} />
      <ThreadMessageList isThread />
      <MessageInput isThread Input={PropInput} />
    </Window>
  );
};

export const Thread = React.memo(UnMemoizedThread);
