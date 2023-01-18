import React, { useEffect, useState } from 'react';
import type { Client, NotifyResponse } from 'web3-mq';

import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { formatDistanceToNow } from '../../utils';

import ss from './index.scss';

export type NotificationPreviewProps = {
  client: Client;
  notification: NotifyResponse;
}
export const NotificationPreview: React.FC<NotificationPreviewProps> = (props) => {
  const { client, notification } = props;
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const targetUserid = notification.content.split(' ')[0];
  useEffect(() => {
    if (notification.type === 'system.followed') {
      client.user.getTargetUserPermissions(targetUserid)
        .then(res => {
          const { data } = res;
          if (data.follow_status === '' || data.follow_status === 'follower') {
            setIsFollow(false);
          } else {
            setIsFollow(true);
          }
        });
    }
  }, []);

  const handleFollowOrCancel = () => {
    client.user.followOperation({
      target_userid: targetUserid,
      action: isFollow ? 'cancel' : 'follow'
    }).then(() => {
      if (isFollow) {
        setIsFollow(false);
      } else {
        setIsFollow(true);
      }
    });
  };
  return (
    <div className={ss.notificationPreviewContainer}>
      <Avatar size={40} />
      <div className={ss.wrapper}>
        <div className={ss.dataInner}>
          <div className={ss.title}>{notification.title}</div>
          <div className={ss.date}>{formatDistanceToNow(notification.timestamp)}</div>
        </div>
        <div className={ss.wrapperBottom}>
          <div className={ss.textContainer}>{notification.content}</div>
          {notification.type === 'system.followed' && 
            <Button style={{marginLeft: '12px'}} type={isFollow ? 'default' : 'primary'} onClick={handleFollowOrCancel}>
              {isFollow ? 'Following' : 'Follow'}
            </Button>
          }
        </div>
      </div>
    </div>
  );
};