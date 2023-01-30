import { useState, useEffect, useCallback } from 'react';
import type { Client, EventTypes } from '@web3mq/client';

import { AppTypeEnum } from '../../../context';
import type {CommonUserInfoType, SearchDidType} from '../../Chat/hooks/useQueryUserInfo';

type StatusType = {
  error: boolean;
  loading: boolean;
};

const PAGE = {
  page: 1,
  size: 20,
};

export const usePaginatedChannels = (
  client: Client,
  appType: AppTypeEnum,
  getUserInfo: (
    didValue: string,
    didType: SearchDidType,
  ) => Promise<CommonUserInfoType | null>,
) => {
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

  const renderChannelList = async (channelList: any[]) => {
    await Promise.all(
      channelList.map(async (channel) => {
        // 私聊添加DID支持
        if (channel.chat_type === 'user') {
          // 通过是否存在homeOwnerInfo字段来判断 该数据是否处理过
          if (!channel.hasOwnProperty('homeOwnerInfo')) {
            const info = await getUserInfo(channel.chatid, 'web3mq');
            channel.homeOwnerInfo = info || {};
          }
        }
      }),
    );
  };

  const handleEvent = useCallback(async (props: { type: EventTypes }) => {
    const { type } = props;
    const { channelList, activeChannel } = client.channel;
    if (!channelList) {
      return;
    }
    if (type === 'channel.getList') {
      await renderChannelList(channelList);
      setChannels(channelList);
    }
    if (!activeChannel && channelList.length !== 0) {
      appType === AppTypeEnum['pc'] && changeActiveChannelEvent(channelList[0]);
    }
    if (type === 'channel.activeChange') {
      setActiveChannel(activeChannel);
      return;
    }
    if (type === 'channel.updated') {
      await renderChannelList(channelList);
      setChannels(channelList);
    }
    if (type === 'channel.created') {
      await renderChannelList(channelList);
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
