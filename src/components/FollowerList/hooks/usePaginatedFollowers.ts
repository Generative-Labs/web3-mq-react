import React, { useState, useEffect, useCallback } from 'react';
import type { Client, ContactListItemType, EventTypes } from '@web3mq/client';

import type { CommonUserInfoType, SearchDidType } from '../../Chat/hooks/useQueryUserInfo';

type StatusType = {
  error: boolean;
  loading: boolean;
};

const PAGE = {
  page: 1,
  size: 20,
};

export type FollowerListItemType = ContactListItemType & {
  address?: string;
  defaultUserName?: string;
  defaultUserAvatar?: string;
  didValueMap?: CommonUserInfoType['didValueMap'];
  is_my_following?: boolean;
  stats?: CommonUserInfoType['stats'];
  timestamp?: number
}

export const useFollower = (props: {
  client: Client, 
  loginUserInfo: CommonUserInfoType,
  getUserInfo: (
    didValue: string,
    didType: SearchDidType,
  ) => Promise<CommonUserInfoType | null>;
}) => {
  const { client, loginUserInfo, getUserInfo } = props;
  const [followers, setFollowers] = useState<Array<FollowerListItemType>>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusType>({
    error: false,
    loading: false,
  });

  const queryFollowers = async () => {
    setRefreshing(true);
    await client.contact.getFollowerList(PAGE)
      .finally(() => {
        setRefreshing(false);
      });
  };

  const loadNextPage = () => {
    if ((client.contact.followerList?.length || 0) < PAGE.size) {
      return;
    }
    PAGE.page++;
    queryFollowers();
  };

  const handleFollowOrUnFollow = async (follower: FollowerListItemType) => {
    if (loginUserInfo) {
      await client.contact.followOperation({
        targetUserid: follower.userid,
        action: follower.follow_status === 'follower' ? 'follow' : 'cancel',
        address: loginUserInfo.wallet_address,
        didType: loginUserInfo.wallet_type as any,
      });
      const { followerList } = client.contact;
      if (followerList) {
        followerList.map(item => {
          if (item.userid === follower.userid && item.wallet_address === follower.wallet_address) {
            item.follow_status = follower.follow_status === 'follower' ? 'follow_each' : 'follower';
          }
        });
        client.emit('contact.getFollowerList',{ type: 'contact.getFollowerList' });
      }
    }
  };

  const RenderFollowerList = useCallback(async (followerList: any[]) => {
    // add dids
    try {
      await Promise.all(
        followerList.map(async (follower) => {
          const info = await getUserInfo(follower.userid, 'web3mq');
          Object.assign(follower, info);
        })
      );
    } catch (error) { 
    }
    
  }, [JSON.stringify(loginUserInfo)]);

  const handleEvent = useCallback(async (props: { type: EventTypes }) => {
    const { type } = props;

    const { followerList } = client.contact;
    if (!followerList) {
      return;
    }
    if (type === 'contact.getFollowerList') {
      setFollowers(followerList);
      setStatus({
        ...status,
        loading: false,
      });
      await RenderFollowerList(followerList);
      setFollowers(followerList);
    }
  }, []);

  useEffect(() => {
    setStatus({
      ...status,
      loading: true,
    });
    queryFollowers();
  }, []);

  return {
    followers,
    refreshing,
    status,
    handleEvent,
    handleFollowOrUnFollow,
    loadNextPage,
  };
};
