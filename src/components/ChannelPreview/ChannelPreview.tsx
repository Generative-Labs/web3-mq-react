import React from 'react';
// import { formatMessageData } from '../../utils';
import { ChannelPreviewMessenger } from './ChannelPreviewMessenger';

export type ChannelPreviewProps = {
  Preview?: React.ComponentType<ChannelPreviewProps>;
  channel: any;
  changeActiveChannelEvent: (channel: any) => void;
  activeChannel: any | null;
};
export const ChannelPreview = (props: ChannelPreviewProps) => {
  const {
    Preview = ChannelPreviewMessenger,
    channel,
    activeChannel,
    changeActiveChannelEvent,
  } = props;

  const isActive = activeChannel?.chatid === channel.chatid;

  const { chatid, chat_name, avatar_url, avatar_base64  } = channel;
  // const { latestMsg, displayTitle, avatarUrl, updatedAt, unread } = formatMessageData(channel);

  // if (typeof latestMsg === 'object') {
  //   return null;
  // }

  return (
    <Preview
      {...props}
      active={isActive}
      channel={channel}
      unread={0}
      displayTitle={chat_name || chatid}
      lastMessage={'latestMsg'}
      updatedAt={'updatedAt'}
      setActiveChannel={changeActiveChannelEvent}
      avatarUrl={avatar_base64 || avatar_url}
    />
  );
};
