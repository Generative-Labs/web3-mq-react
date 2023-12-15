import React, { useEffect, useState } from 'react';
import type { Client, NotifyResponse } from '@web3mq/client';

import { Avatar } from '../Avatar';
import { Button } from '../Button';
import type { CommonUserInfoType } from '../Chat/hooks/useQueryUserInfo';

import { formatDistanceToNow } from '../../utils';

import ss from './index.scss';
import { useOperatePermissions } from '../MessageConsole/hooks/useOperatePermissions';

export type NotificationPreviewProps = {
  client: Client;
  notification: NotifyResponse;
  userInfo?: CommonUserInfoType;
  setActiveNotification: (activeNotification: NotifyResponse | null) => void;
};
export const NotificationPreview: React.FC<NotificationPreviewProps> = (props) => {
  const { client, notification, userInfo, setActiveNotification } = props;
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const targetUserid = notification.content.split(' ')[0];
  const { targetUserPermissions, getTargetUserPermissions } = useOperatePermissions(client);

  const handleFollowOrCancel = async (e: React.BaseSyntheticEvent) => {
    e.stopPropagation();
    if (userInfo) {
      setLoading(true);
      await client.contact
        .followOperation({
          targetUserid: targetUserid,
          action: isFollow ? 'cancel' : 'follow',
          address: userInfo.address,
          didType: userInfo.wallet_type as any,
        })
        .then(async () => {
          setLoading(false);
          if (isFollow) {
            setIsFollow(false);
          } else {
            setIsFollow(true);
            await client.channel.updateChannels({
              chatid: targetUserid,
              chatType: 'user',
              topic: targetUserid,
              topicType: 'user',
            });
            const { channelList } = client.channel;
            let size = 20;
            if (channelList) {
              size = channelList.length + (20 - (channelList.length % 20));
            }
            await client.channel.queryChannels({ page: 1, size: size });
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  const handleClick = () => {
    if (notification.type === 'system.friend_request' && notification.come_from) {
      setActiveNotification(notification);
    } else {
      setActiveNotification(null);
    }
  };

  useEffect(() => {
    if (notification && notification.type === 'system.followed' && notification?.come_from) {
      getTargetUserPermissions(notification?.come_from);
    }
  }, [notification]);

  return (
    <div className={ss.notificationPreviewContainer} onClick={handleClick}>
      <Avatar size={40} />
      <div className={ss.wrapper}>
        <div className={ss.dataInner}>
          <div className={ss.title}>{notification.title}</div>
          <div className={ss.date}>{formatDistanceToNow(notification.timestamp)}</div>
        </div>
        <div className={ss.wrapperBottom}>
          <div className={ss.textContainer}>{notification.content}</div>
          {notification.type === 'system.followed' && (
            <Button
              disabled={
                ['follow_each', 'following'].includes(targetUserPermissions.follow_status) ||
                isFollow ||
                loading
              }
              style={{ marginLeft: '12px' }}
              type={
                ['follow_each', 'following'].includes(targetUserPermissions.follow_status) ||
                isFollow
                  ? 'default'
                  : 'primary'
              }
              onClick={handleFollowOrCancel}
            >
              {['follow_each', 'following'].includes(targetUserPermissions.follow_status) ||
              isFollow
                ? 'Following'
                : 'Follow'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
