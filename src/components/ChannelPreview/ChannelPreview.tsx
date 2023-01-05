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
  const { 
    chatid, 
    chat_name,
    chat_type,
    avatar_url, 
    avatar_base64, 
    unread, 
    lastMessage, 
    updatedAt,
  } = channel;
  const { 
    defaultUserAvatar = '', 
    defaultUserName = '', 
  } = channel.homeOwnerInfo || {};

  const hasNickName = chat_name.indexOf('user:') !== 0 ? true : false;
  const chatName = chat_type !== 'user' ? 
    chat_name 
    : hasNickName 
      ? chat_name 
      : 
      defaultUserName;
  const avatarUrl = avatar_base64 || avatar_url || (chat_type === 'user' && defaultUserAvatar);

  return (
    <Preview
      {...props}
      active={isActive}
      channel={channel}
      unread={unread || 0}
      displayTitle={chatName}
      lastMessage={lastMessage}
      updatedAt={updatedAt}
      setActiveChannel={changeActiveChannelEvent}
      avatarUrl={avatarUrl}
    />
  );
};
