import React, { PropsWithChildren, useEffect, useMemo } from 'react';
import cx from 'classnames';
import type { Client } from 'web3-mq';
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
  const { userInfo, getLoginUserInfo, getUserInfo } = useQueryUserInfo(client);

  useEffect(() => {
    getLoginUserInfo();
  }, []);

  const chatContextValue: ChatContextValue = useMemo(
    () => ({
      client,
      containerId,
      appType,
      userInfo,
      getUserInfo,
      showListTypeView,
      setShowListTypeView,
      logout,
    }),
    [showListTypeView, appType, userInfo], // channel id变化需要重新render
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
