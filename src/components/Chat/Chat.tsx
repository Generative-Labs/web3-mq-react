import React, { PropsWithChildren, useMemo } from 'react';
import cx from 'classnames';
import type { Client } from 'web2-mq';
import { ChatProvider, ChatContextValue, AppTypeEnum } from '../../context/ChatContext';
import { useChat } from './hooks/useChat';

import { useShowListTypeView } from './hooks/useShowListTypeView';

import ss from './index.scss';

export type ChatProps = {
  client: Client;
  className?: string;
  appType?: AppTypeEnum;
  style?: React.CSSProperties;
  logout: () => void;
};

export const Chat = (props: PropsWithChildren<ChatProps>) => {
  const {
    children,
    client,
    appType = AppTypeEnum['pc'],
    className = '',
    style = {},
    logout,
  } = props;
  const { showCreateChannel, setShowCreateChannel } = useChat();
  const { showListTypeView, setShowListTypeView } = useShowListTypeView();
  const chatContextValue: ChatContextValue = useMemo(
    () => ({
      client,
      appType,
      showCreateChannel,
      showListTypeView,
      setShowCreateChannel,
      setShowListTypeView,
      logout,
    }),
    [showCreateChannel, showListTypeView, appType], // channel id变化需要重新render
  );

  return (
    <ChatProvider value={chatContextValue}>
      <div
        style={style}
        className={cx(className, ss.chatContainer, {
          [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
        })}
      >
        {children}
      </div>
    </ChatProvider>
  );
};
