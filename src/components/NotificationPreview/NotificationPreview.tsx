import React from 'react';
import type { NotifyResponse } from 'web3-mq';
import { Avatar } from '../Avatar';
import { formatDistanceToNow } from '../../utils';

import ss from './index.scss';

export type NotificationPreviewProps = {
  notification: NotifyResponse;
}
export const NotificationPreview: React.FC<NotificationPreviewProps> = (props) => {
  const { notification } = props;

  return (
    <div className={ss.notificationPreviewContainer}>
      <Avatar size={40} />
      <div className={ss.wrapper}>
        <div className={ss.dataInner}>
          <div className={ss.title}>{notification.title}</div>
          <div className={ss.date}>{formatDistanceToNow(notification.timestamp)}</div>
        </div>
        <div className={ss.textContainer}>{notification.content}</div>
      </div>
    </div>
  );
};