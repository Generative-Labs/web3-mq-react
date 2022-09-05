import { useState, useEffect, useCallback, useRef } from 'react';
import type { Client, NotificationResponse, EventTypes } from 'web2-mq';

type StatusType = {
  error: boolean;
  loading: boolean;
};

export const usePaginatedNotifications = (client: Client) => {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [status, setStatus] = useState<StatusType>({
    error: false,
    loading: false,
  });
  const [unReadCount, setUnReadCount] = useState<number | undefined>(undefined);
  const [isContactUpdate, setIsContactUpdate] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const noMoreRef = useRef<boolean>(false);
  const notifyRef = useRef<string[]>([]);

  const getNotificationList = async () => {
    await client.notify.getRecvNotificationList();
  };

  const loadNextPage = async () => {
    if (noMoreRef.current) return;
    setRefreshing(true);
    const data = await client.notify.loadMoreRecvNotificationList();
    setRefreshing(false);
    if (data.length === 0) {
      noMoreRef.current = true;
    }
    return data.length === 0;
  };

  const handleEvent = useCallback((props: { type: EventTypes }) => {
    const { type } = props;
    const { notificationList, _unReadCount } = client.notify;
    if (!notificationList) return;
    if (type === 'contact.getList') {
      setIsContactUpdate(!isContactUpdate);
      return;
    }
    if (type === 'notification.messageNew') {
      // setUnReadCount(_unReadCount);
      return;
    }
    if (type === 'notification.getList') {
      notifyRef.current = Array.from(new Set(notificationList.map((item) => item.sender_id)));
      setNotifications(notificationList);
      setUnReadCount(_unReadCount);
    }
    setStatus({
      ...status,
      loading: false,
    });
  }, []);

  const readNotification = () => {
    const { readAllRecvNotifications } = client.notify;
    readAllRecvNotifications();
    setUnReadCount(client.notify._unReadCount);
  };

  useEffect(() => {
    getNotificationList();
    setStatus({
      ...status,
      loading: true,
    });
  }, []);

  return {
    status,
    notifications,
    refreshing,
    unReadCount,
    notifyArr: notifyRef.current,
    isContactUpdate,
    loadNextPage,
    handleEvent,
    readNotification,
  };
};
