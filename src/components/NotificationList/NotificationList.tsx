import React, { useEffect } from 'react';
import cx from 'classnames';
import type { NotifyResponse } from 'web3-mq';

import { usePaginatedNotifications } from './hooks/usePaginatedNotifications';
import { NotificationPreview } from '../NotificationPreview';
import { useChatContext } from '../../context/ChatContext';

import ss from './index.scss';

export type NotificationShowType = 'list' | 'modal';
export type NotificationListProps = {
  className?: string;
  Notification?: React.ComponentType<any>;
  style?: React.CSSProperties;
}

export const NotificationList: React.FC<NotificationListProps> = (props) => {
  const { className, Notification, style } = props;
  const { client } = useChatContext();
  const { notifications, handleEvent, setNotifications } =
    usePaginatedNotifications(client);
  const Preview = Notification || NotificationPreview;

  useEffect(() => {
    setNotifications(client.notify.notificationList || []);
    client.on('notification.messageNew', handleEvent);
    client.on('notification.getList', handleEvent);
    return () => {
      client.off('notification.messageNew');
      client.off('notification.getList');
    };
  }, []);

  const renderContact = (item: NotifyResponse, index: number) => {
    const props = {
      key: index,
      notification: item
    };
    return <Preview {...props} />;
  };

  return (
    <div className={cx(ss.notificationContainer, className)} style={style}>
      {notifications?.map(renderContact)}
    </div>
  );
};
