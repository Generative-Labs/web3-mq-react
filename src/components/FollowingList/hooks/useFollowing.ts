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

export const useFollowing = (client: Client) => {
  const [followings, setFollowings] = useState<Array<any>>([]);
  const [status, setStatus] = useState<StatusType>({
    error: false,
    loading: false,
  });

  const queryFollowings = async () => {
    setStatus({
      ...status,
      loading: true,
    });
    const { user_list } = await client.user.getFollowingList(PAGE);
    setFollowings(user_list);
    setStatus({
      ...status,
      loading: false,
    });
  };

  useEffect(() => {
    queryFollowings();
  }, []);

  return {
    followings,
    queryFollowings,
    status,
  };
};
