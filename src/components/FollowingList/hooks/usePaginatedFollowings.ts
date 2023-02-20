import React, { useCallback, useState, useEffect } from 'react';
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

export type FollowingListItemType = ContactListItemType & {
  address?: string;
  defaultUserName?: string;
  defaultUserAvatar?: string;
  didValueMap?: CommonUserInfoType['didValueMap'];
  is_my_following?: boolean;
  stats?: CommonUserInfoType['stats'];
  timestamp?: number
}

export const useFollowing = (props: {
  client: Client, 
  loginUserInfo: CommonUserInfoType,
  getUserInfo: (
    didValue: string,
    didType: SearchDidType,
  ) => Promise<CommonUserInfoType | null>;
}) => {
  const { client, loginUserInfo, getUserInfo } = props;
  const [followings, setFollowings] = useState<Array<any>>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusType>({
    error: false,
    loading: false,
  });

  const queryFollowings = async () => {
    setRefreshing(true);
    await client.contact.getFollowingList(PAGE)
      .finally(() => {
        setRefreshing(false);
      });
  };

  const loadNextPage = () => {
    if ((client.contact.followingList?.length || 0) < PAGE.size) {
      return;
    }
    PAGE.page++;
    queryFollowings();
  };

  const handleFollowOrUnFollow = async (following: FollowingListItemType) => {
    if (loginUserInfo) {
      await client.contact.followOperation({
        targetUserid: following.userid,
        action: 'cancel',
        address: loginUserInfo.wallet_address,
        didType: loginUserInfo.wallet_type as any,
      });
      const { followingList } = client.contact;
      if (followingList) {
        PAGE.page = 1;
        await queryFollowings();
      }
    }
  };
  const renderFollowingList = useCallback(async (followingList: any[]) => {
    // add dids
    try {
      await Promise.all(
        followingList.map(async (following) => {
          const info = await getUserInfo(following.userid, 'web3mq');
          Object.assign(following, info);
        })
      );
    } catch (error) { 
    }
  }, [JSON.stringify(loginUserInfo)]);

  const handleEvent = useCallback(async (props: { type: EventTypes }) => {
    const { type } = props;

    const { followingList } = client.contact;
    if (!followingList) {
      return;
    }
    if (type === 'contact.getFollowingList') {
      setFollowings(followingList);
      setStatus({
        ...status,
        loading: false,
      });
      await renderFollowingList(followingList);
      setFollowings(followingList);
    }
  }, []);

  useEffect(() => {
    setStatus({
      ...status,
      loading: true,
    });
    queryFollowings();
  }, []);

  return {
    followings,
    refreshing,
    status,
    handleEvent,
    handleFollowOrUnFollow,
    loadNextPage,
  };
};