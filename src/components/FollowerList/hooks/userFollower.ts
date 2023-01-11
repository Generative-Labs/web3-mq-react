import React, { useState, useEffect } from 'react';
import type { Client } from 'web3-mq';

type StatusType = {
  error: boolean;
  loading: boolean;
};

const PAGE = {
  page: 1,
  size: 999,
};

export const useFollower = (client: Client) => {
  const [followers, setFollowers] = useState<Array<any>>([]);
  const [status, setStatus] = useState<StatusType>({
    error: false,
    loading: false,
  });

  const queryFollowers = async () => {
    setStatus({
      ...status,
      loading: true,
    });
    const { user_list } = await client.user.getFollowerList(PAGE);
    setFollowers(user_list);
    setStatus({
      ...status,
      loading: false,
    });
  };

  useEffect(() => {
    queryFollowers();
  }, []);

  return {
    followers,
    queryFollowers,
    status,
  };
};
