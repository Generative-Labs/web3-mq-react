import { useState, useEffect, useCallback } from 'react';
import type { EventTypes, Client } from '@web3mq/client';

type StatusType = {
  error: boolean;
  loading: boolean;
};

type PaginatedType = 'all' | 'sub' | 'create';

const PAGE = {
  page: 1,
  size: 20,
};

export const usePaginatedTopics = (client: Client) => {
  const [createTopics, setCreateTopics] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusType>({
    error: false,
    loading: false,
  });

  const getMyCreateTopicList = async () => {
    setRefreshing(true);
    await client.topic.getMyCreateTopicList(PAGE);
    setRefreshing(false);
  };

  const loadNextPage = () => {
    if ((client.topic.myTopicList?.length || 0) < PAGE.size) {
      return;
    }
    PAGE.page++;
    getMyCreateTopicList();
  };

  const handleEvent = useCallback((props: { type: EventTypes }) => {
    const { type } = props;

    const { myTopicList } = client.topic;
    if (!myTopicList) {
      return;
    }
    if (type === 'notification.getMyTopicList') {
      setCreateTopics(myTopicList);
    }
    setStatus({
      ...status,
      loading: false,
    });
  }, []);

  useEffect(() => {
    client.on('notification.getMyTopicList', handleEvent);
    return () => {
      client.off('notification.getMyTopicList', handleEvent);
    };
  }, []);

  useEffect(() => {
    PAGE.page = 1;
    setStatus({
      ...status,
      loading: true,
    });
    getMyCreateTopicList();
  }, []);

  return {
    status,
    createTopicList: createTopics,
    refreshing,
    loadNextPage,
    handleEvent,
  };
};
