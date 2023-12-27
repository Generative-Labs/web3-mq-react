import React, { PropsWithChildren, useCallback } from 'react';
import cx from 'classnames';

import { Avatar } from '../Avatar';
// import { formatMessageData } from '../../utils';
import { ArrowLeft, ThreadIcon } from '../../icons';
import { useChannelStateContext } from '../../context/ChannelStateContext';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { useChannelActionContext } from '../../context/ChannelActionContext';

import ss from './index.scss';
import {GroupSettings} from '../GroupSettings';

export type MessageHeaderProps = {
  avatarName?: string;
  avatarImg?: string[];
  avatarSize?: number;
  title?: string;
};

export const MessageHeader = (props: PropsWithChildren<MessageHeaderProps>) => {
  const { activeChannel } = useChannelStateContext('MessageHeader');
  const { handleOpenAllThread } = useChannelActionContext('MessageHeader');
  const { appType, client } = useChatContext('MessageHeader');

  const handleClose = useCallback(() => {
    client.channel.setActiveChannel(null);
  }, []);

  if (!activeChannel) {
    return null;
  }

  const { chatid, chat_type, chat_name, avatar_url, avatar_base64, homeOwnerInfo = {} } = activeChannel;
  const { defaultUserAvatar, defaultUserName } = homeOwnerInfo;

  const { 
    avatarName = 'displayTitle', 
    avatarImg = defaultUserAvatar || avatar_url || avatar_base64, 
    title = defaultUserName || chat_name || chatid, 
    avatarSize = 32 
  } = props;

  return (
    <div
      className={cx(ss.messageHeaderContainer, { [ss.mobileStyle]: appType !== AppTypeEnum['pc'] })}
    >
      <div className={ss.warp}>
        {appType !== AppTypeEnum['pc'] && (
          <div className={ss.close} onClick={handleClose}>
            <ArrowLeft />
          </div>
        )}
        {/* <AvatarGroup name={avatarName} images={avatarImg} size={avatarSize} shape="rounded" /> */}
        <Avatar name={avatarName} size={avatarSize} shape="rounded" image={avatarImg} />
        <div className={ss.title}>{title}</div>
      </div>
      <div className={ss.operationBar}>
        {chat_type === 'group' && <GroupSettings />}
        {/*<div className={ss.icon} onClick={handleOpenAllThread}>*/}
        {/*  <ThreadIcon />*/}
        {/*  {appType === AppTypeEnum['pc'] && <div>All Thread</div>}*/}
        {/*</div>*/}
      </div>
    </div>
  );
};
