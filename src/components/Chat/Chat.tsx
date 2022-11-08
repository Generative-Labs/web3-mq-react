import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import type { Client, SearchUsersResponse } from 'web3-mq';
import { ChatProvider, ChatContextValue, AppTypeEnum } from '../../context/ChatContext';
import { useChat } from './hooks/useChat';

import { useShowListTypeView } from './hooks/useShowListTypeView';

import ss from './index.scss';

export type ChatProps = {
  client: Client;
  containerId?: string;
  className?: string;
  appType?: AppTypeEnum;
  style?: React.CSSProperties;
  logout: () => void;
};

const UnMemoizedChat = (props: PropsWithChildren<ChatProps>) => {
  const {
    children,
    containerId = '',
    client,
    appType = AppTypeEnum['pc'],
    className = '',
    style = {},
    logout,
  } = props;

  const { showCreateChannel, setShowCreateChannel } = useChat();
  const { showListTypeView, setShowListTypeView } = useShowListTypeView();
  const [userInfo, setUserInfo] = useState<SearchUsersResponse | null>(null);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = useCallback(async () => {
    const userInfo = await client.user.getMyProfile();
    setUserInfo(userInfo);
  }, []);

  const chatContextValue: ChatContextValue = useMemo(
    () => ({
      client,
      containerId,
      appType,
      userInfo,
      showCreateChannel,
      showListTypeView,
      setShowCreateChannel,
      setShowListTypeView,
      logout,
    }),
    [showCreateChannel, showListTypeView, appType, userInfo], // channel id变化需要重新render
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

export const Chat = React.memo(UnMemoizedChat);
