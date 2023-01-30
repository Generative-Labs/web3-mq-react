import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import type { Client, NotifyResponse } from '@web3mq/client';
import { ChatProvider, ChatContextValue, AppTypeEnum } from '../../context/ChatContext';
import { useQueryUserInfo } from './hooks/useQueryUserInfo';

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

  const { showListTypeView, setShowListTypeView } = useShowListTypeView();
  const { getUserInfo, loginUserInfo, getLoginUserInfo } = useQueryUserInfo(client);
  const [ activeNotification, setActiveNotification ] = useState<NotifyResponse | null>(null);

  useEffect(() => {
    getLoginUserInfo().then();
  }, []);

  const chatContextValue: ChatContextValue = useMemo(
    () => ({
      client,
      containerId,
      appType,
      activeNotification,
      setActiveNotification,
      showListTypeView,
      setShowListTypeView,
      logout,
      getUserInfo,
      loginUserInfo,
    }),
    [showListTypeView, appType, activeNotification, JSON.stringify(loginUserInfo)], // channel id变化需要重新render
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
