import { useState, useEffect, useCallback } from 'react';
import type { Client, EventTypes } from 'web3-mq';

import { AppTypeEnum } from '../../../context/ChatContext';

type StatusType = {
  error: boolean;
  loading: boolean;
};

const PAGE = {
  page: 1,
  size: 20,
};

export const usePaginatedChannels = (client: Client, appType: AppTypeEnum) => {
  const [channels, setChannels] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeChannel, setActiveChannel] = useState<any | null>(null);
  const [status, setStatus] = useState<StatusType>({
    error: false,
    loading: false,
  });

  const queryChannels = async () => {
    setRefreshing(true);
    await client.channel.queryChannels(PAGE);
    setRefreshing(false);
  };

  const changeActiveChannelEvent = async (channel: any) => {
    await client.channel.setActiveChannel(channel);
  };

  const loadNextPage = () => {
    if ((client.channel.channelList?.length || 0) < PAGE.size) {
      return;
    }
    PAGE.page++;
    queryChannels();
  };

  const handleEvent = useCallback(async (props: { type: EventTypes }) => {
    const { type } = props;
    const { channelList, activeChannel } = client.channel;
    if (!channelList) {
      return;
    }
    if (!activeChannel && channelList.length !== 0) {
      appType === AppTypeEnum['pc'] && changeActiveChannelEvent(channelList[0]);
    }
    if (type === 'channel.activeChange') {
      setActiveChannel(activeChannel);
      return;
    }
    if (type === 'channel.updated') {
      setChannels(channelList);
    }
    if (type === 'channel.getList') {
      setChannels(channelList);
    }
    if (type === 'channel.created') {
      setChannels(channelList);
    }
    setStatus({
      ...status,
      loading: false,
    });
  }, []);

  useEffect(() => {
    setStatus({
      ...status,
      loading: true,
    });
    queryChannels();
  }, []);

  return {
    status,
    channels,
    refreshing,
    loadNextPage,
    handleEvent,
    activeChannel,
    changeActiveChannelEvent,
    setActiveChannel,
  };
};
