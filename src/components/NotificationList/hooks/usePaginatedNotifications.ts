import { useState, useCallback, useEffect } from 'react';
import type { Client, EventTypes, NotifyResponse } from '@web3mq/client';

const PAGE = {
  page: 1,
  size: 20,
};
type StatusType = {
  error: boolean;
  loading: boolean;
};
export const usePaginatedNotifications = (client: Client) => {
  const [notifications, setNotifications] = useState<NotifyResponse[] | null>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [unReadCount, setUnReadCount] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<StatusType>({
    error: false,
    loading: false,
  });

  const handleEvent = useCallback((props: { type: EventTypes }) => {
    const { type } = props;
    const { notificationList } = client.notify;
    if (!notificationList) return;
    if (type === 'notification.getList') {
      setNotifications(notificationList);
    }

    setStatus({
      ...status,
      loading: false,
    });
  }, []);

  const handleFirendRequest = async (targetIUserid: string, action: any) => {
    const data = await client.contact.operationFriend(targetIUserid, action);
    console.log(data);
  };
  const queryChannels = async () => {
    setRefreshing(true);
    await client.notify.queryNotifications(PAGE);
    setRefreshing(false);
  };

  const loadNextPage = () => {
    if ((client.notify.notificationList?.length || 0) < PAGE.size * PAGE.page) {
      return;
    }
    PAGE.page++;
    queryChannels();
  };

  useEffect(() => {
    setStatus({
      ...status,
      loading: true,
    });
    queryChannels();
  }, []);

  return {
    status,
    loadNextPage,
    notifications,
    unReadCount,
    handleEvent,
    handleFirendRequest,
    setNotifications,
    refreshing,
  };
};
