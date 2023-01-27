import { useState, useCallback } from 'react';
import type { Client } from 'web3-mq';

const PAGE = {
  page: 1,
  size: 20,
};

export const useSearchFollower = (client: Client) => {
  const [followers, setFollowers] = useState<any[]>([]);
  const [searchFollowers, setSearchFollowers] = useState<any[]>([]);

  const getFollowerList = async () => {
    const data = await client.contact.getFollowerList(PAGE);
    setFollowers(data);
  };

  const handleSearchFollers = useCallback(
    (value: string) => {
      setSearchFollowers(
        followers.filter((follower) => follower.wallet_address.indexOf(value) >= 0),
      );
    },
    [followers],
  );

  return {
    followers,
    searchFollowers,
    getFollowerList,
    handleSearchFollers,
    setFollowers,
  };
};
