import React, { useEffect } from 'react';
import cx from 'classnames';
import type { NotifyResponse } from '@web3mq/client';

import { usePaginatedNotifications } from './hooks/usePaginatedNotifications';
import { Empty } from '../Empty';
import { NotificationPreview } from '../NotificationPreview';
import { useChatContext } from '../../context/ChatContext';
import { NotificationIcon } from '../../icons';

import ss from './index.scss';

export type NotificationShowType = 'list' | 'modal';
export type NotificationListProps = {
  EmptyContaniner?: React.ReactNode;
  className?: string;
  Notification?: React.ComponentType<any>;
  style?: React.CSSProperties;
}

export const NotificationList: React.FC<NotificationListProps> = (props) => {
  const { className, EmptyContaniner, Notification, style } = props;
  const { client, loginUserInfo, setActiveNotification } = useChatContext();
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
      client,
      key: index,
      notification: item,
      userInfo: loginUserInfo || undefined,
      setActiveNotification: setActiveNotification,
    };
    return <Preview {...props} />;
  };

  return (
    <div className={cx(ss.notificationContainer, className)} style={style}>
      {notifications?.length === 0 ? (
        <>
          {EmptyContaniner || <Empty description='No notification message' icon={<NotificationIcon className={ss.notificationIcon} />} />}
        </>
      ) : (
        <>
          {notifications?.map(renderContact)}
        </>
      )}
    </div>
  );
};
