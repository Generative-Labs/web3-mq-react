import React, { useEffect } from 'react';

import { useOperatePermissions } from './hooks/useOperatePermissions';

import { FollowRequestButtonGroup } from '../FollowRequestButtonGroup';
import { MessageInput } from '../MessageInput';
import { useChannelStateContext, useChatContext } from '../../context';

type MessageConsoleProps = {
  OperateContainer?: React.ComponentType<any>;
  Input?: React.ReactNode;
  warnText?: string;
}
export const MessageConsole: React.FC<MessageConsoleProps> = (props) => {
  const { 
    Input, 
    OperateContainer = FollowRequestButtonGroup, 
    warnText 
  } = props;
  const { client } = useChatContext('MessageConsole');
  const { activeChannel } = useChannelStateContext('MessageConsole');
  const { targetUserPermissions, toChatTargetUser, getTargetUserPermissions, updateTargetUserPermissions } = useOperatePermissions(client);
  const curActiveChannel = activeChannel || client.channel.activeChannel;
  const isGroup = curActiveChannel?.chat_type === 'group';

  useEffect(() => {
    if (curActiveChannel && !isGroup) {
      getTargetUserPermissions(curActiveChannel.chatid);
    }
  }, []);

  const getWarnText = () => {
    const { permissions, follow_status } =targetUserPermissions;
    if (toChatTargetUser || !permissions['user:chat']) return '';
    // 对方权限是follower or 对方权限是friend 我只被对方关注
    if (permissions['user:chat'].value === 'follower' || permissions['user:chat'].value === 'friend' && follow_status === 'follower') {
      return 'The other party has set the privacy permission you need to follow each other';
    }
    // 对方权限是following or 对方权限是friend 我只关注对方
    if (targetUserPermissions.permissions['user:chat'].value === 'following' || permissions['user:chat'].value === 'friend' && follow_status === 'following') {
      return 'The other party set the privacy permission need to ask the other party to follow you';
    }
    // 对方权限是friend 我没关注对方 对方也没关注我
    if (targetUserPermissions.permissions['user:chat'].value === 'friend' && follow_status === '') {
      return 'The other party has set privacy rights, you need to follow and send a request message';
    }
    return '';
  };

  const getShowFollow = () => {
    const { permissions, follow_status } = targetUserPermissions;
    if (permissions['user:chat']) {
      if (permissions['user:chat'].value === 'follower' && (follow_status === '' || follow_status === 'follower') || 
        permissions['user:chat'].value === 'friend' && follow_status === 'follower'
      ) return true;
      return false;
    }
    return false;
  };

  const handleFollow = async () => {
    if (targetUserPermissions.follow_status === 'follower') {
      updateTargetUserPermissions('follow_status', 'follow_each');
    }
    if (targetUserPermissions.follow_status === '') {
      updateTargetUserPermissions('follow_status', 'following');
    }
  };

  if (!curActiveChannel) return null;

  if (isGroup || toChatTargetUser) return (
    <>
      { Input || <MessageInput /> }
    </>
  );

  return (
    <OperateContainer
      client={client}
      showBlockBtn={targetUserPermissions.permissions['user:chat']?.value === 'friend' && targetUserPermissions.follow_status === ''}
      showFollow={getShowFollow()}
      userId={targetUserPermissions.target_userid}
      warnText={warnText || getWarnText()} 
      onFollow={handleFollow}
    />
  );
};