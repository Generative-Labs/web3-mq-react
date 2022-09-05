import React from 'react';
import { formatMessageData } from '../../utils';
import { ChannelPreviewMessenger } from './ChannelPreviewMessenger';
import type { ChannelResponse } from 'web2-mq';

export type ChannelPreviewProps = {
  Preview?: React.ComponentType<ChannelPreviewProps>;
  channel: ChannelResponse;
  changeActiveChannelEvent: (channel: ChannelResponse) => void;
  activeChannel: ChannelResponse | null;
};
export const ChannelPreview = (props: ChannelPreviewProps) => {
  const {
    Preview = ChannelPreviewMessenger,
    channel,
    activeChannel,
    changeActiveChannelEvent,
  } = props;

  const isActive = activeChannel?.room_id === channel.room_id;

  const { latestMsg, displayTitle, avatarUrl, updatedAt, unread } = formatMessageData(channel);

  if (typeof latestMsg === 'object') {
    return null;
  }

  return (
    <Preview
      {...props}
      active={isActive}
      channel={channel}
      unread={unread}
      displayTitle={displayTitle}
      lastMessage={latestMsg}
      updatedAt={updatedAt}
      setActiveChannel={changeActiveChannelEvent}
      avatarUrl={avatarUrl}
    />
  );
};
