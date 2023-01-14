import { useState, useCallback } from 'react';
import type { Client, EventTypes, NotifyResponse } from 'web3-mq';

export const usePaginatedNotifications = (client: Client) => {
  const [notifications, setNotifications] = useState<NotifyResponse[] | null>([]);
  const [unReadCount, setUnReadCount] = useState<number | undefined>(undefined);

  const handleEvent = useCallback((props: { type: EventTypes }) => {
    const { type } = props;
    const { notificationList } = client.notify;
    if (!notificationList) return;
    if (type === 'notification.getList') {
      setNotifications(notificationList);
    }
  }, []);

  const handleFirendRequest = async (targetIUserid: string, action: any) => {
    const data = await client.contact.operationFriend(targetIUserid, action);
    console.log(data);
  };

  return {
    notifications,
    unReadCount,
    handleEvent,
    handleFirendRequest,
    setNotifications,
  };
};
