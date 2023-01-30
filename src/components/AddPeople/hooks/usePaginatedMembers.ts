import { useEffect, useState } from 'react';
import type { Client, EventTypes } from '@web3mq/client';

const PAGE = {
  page: 1,
  size: 20,
};

export const usePaginatedMembers = (client: Client, visible: boolean) => {
  const [memberList, setMemberList] = useState<any[]>([]);
  const [memberListloading, setMemberListloading] = useState<boolean>(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);

  const getGroupMemberList = async () => {
    setMemberListloading(true);
    const data = await client.channel.getGroupMemberList(PAGE);
    setMemberList(data?.data.result);
    setMemberListloading(false);
  };

  const loadNextPage = async () => {
    if ((memberList.length || 0) < PAGE.size) {
      return;
    }
    PAGE.page++;
    setLoadMoreLoading(true);
    const data = await client.channel.getGroupMemberList(PAGE);
    setMemberList(data?.data.result);
    setLoadMoreLoading(false);
  };

  useEffect(() => {
    if (visible) {
      PAGE.page = 1;
      getGroupMemberList();
    }
  }, [visible]);

  return {
    memberList,
    memberListloading,
    loadMoreLoading,
    loadNextPage,
  };
};
