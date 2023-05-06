import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import type { NotifyResponse } from '@web3mq/client';

import { usePaginatedNotifications } from './hooks/usePaginatedNotifications';
import { Empty } from '../Empty';
import { NotificationPreview } from '../NotificationPreview';
import { useChatContext } from '../../context/ChatContext';
import { NotificationIcon } from '../../icons';
import { Paginator as defaultPaginator, PaginatorProps } from '../Paginator';

import ss from './index.scss';
import { NotificationListMessenger } from './NotificationListMessenger';

export type NotificationShowType = 'list' | 'modal';
export type NotificationListProps = {
  List?: React.ComponentType<NotificationListProps>;
  EmptyContaniner?: React.ReactNode;
  className?: string;
  Notification?: React.ComponentType<any>;
  Paginator?: React.ComponentType<PaginatorProps>;
  style?: React.CSSProperties;
};

export const NotificationList: React.FC<NotificationListProps> = (props) => {
  const {
    className,
    EmptyContaniner = (
      <Empty
        description="No notification message"
        icon={<NotificationIcon className={ss.notificationIcon} />}
      />
    ),
    Notification,
    style,
    List = NotificationListMessenger,
    Paginator = defaultPaginator,
  } = props;
  const { client, loginUserInfo, setActiveNotification } = useChatContext();
  const { notifications, handleEvent, setNotifications, status, loadNextPage, refreshing } =
    usePaginatedNotifications(client);
  const Preview = Notification || NotificationPreview;
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
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
    <List loading={status.loading} error={status.error} listRef={listRef}>
      {notifications?.length === 0 ? (
        <>
          {EmptyContaniner || (
            <Empty
              description="No notification message"
              icon={<NotificationIcon className={ss.notificationIcon} />}
            />
          )}
        </>
      ) : (
        <Paginator element={listRef} showLoading={refreshing} loadNextPage={loadNextPage}>
          {notifications?.map(renderContact)}
        </Paginator>
      )}
    </List>
  );
};
