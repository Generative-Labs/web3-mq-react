import React from 'react';
import cx from 'classnames';
import type { ChannelResponse } from 'web2-mq';

import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { AvatarGroup } from '../AvatarGroup';

import ss from './index.scss';

export type ChannelPreviewUIComponentProps = {
  Avatar?: React.ComponentType;
  channel: ChannelResponse;
  unread: number;
  lastMessage: string;
  displayTitle: string;
  updatedAt: string;
  active: boolean;
  avatarUrl: string[];
  setActiveChannel?: (channel: ChannelResponse) => void;
};

const UnMemoizedChannelPreviewMessenger = (props: ChannelPreviewUIComponentProps) => {
  const {
    Avatar = AvatarGroup,
    lastMessage,
    unread,
    displayTitle,
    updatedAt,
    setActiveChannel,
    channel,
    active,
    avatarUrl,
  } = props;
  const { setShowCreateChannel, showCreateChannel, appType } = useChatContext();

  // useEffect(() => {
  //   onSetActiveChannel();
  // }, []);

  const onSetActiveChannel = () => {
    if (showCreateChannel) {
      setShowCreateChannel(!showCreateChannel);
    }
    setActiveChannel && setActiveChannel(channel);
  };

  return (
    <div
      className={cx(ss.channelPreviewContainer, {
        [ss.selected]: active,
        [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
      })}
      onClick={onSetActiveChannel}
    >
      <Avatar name="user1" images={avatarUrl} size={40} shape="rounded" />
      <div className={ss.wrapper}>
        <div className={ss.previewTop}>
          <div className={ss.title}>{displayTitle}</div>
          <div className={ss.updateTime}>{updatedAt}</div>
        </div>
        <div className={ss.lastMessage}>{lastMessage}</div>
        {unread !== 0 && <div className={ss.unread}>{unread}</div>}
      </div>
    </div>
  );
};

export const ChannelPreviewMessenger = React.memo(
  UnMemoizedChannelPreviewMessenger,
) as typeof UnMemoizedChannelPreviewMessenger;
