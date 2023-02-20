import { useState, useCallback, useRef } from 'react';
import type { Client } from '@web3mq/client';
import type {CommonUserInfoType, SearchDidType} from '../../Chat/hooks/useQueryUserInfo';
const PAGE = {
  page: 1,
  size: 6,
};

export const useSearchFollowContacts = (
  client: Client, 
  getUserInfo: (
    didValue: string,
    didType: SearchDidType,
  ) => Promise<CommonUserInfoType | null>,
) => {
  const [followContacts, setFollowContacts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchFollowContacts, setSearchFollowContacts] = useState<any[]>([]);
  const noMoreRef = useRef<boolean>(false);
  const getFollowContactsList = async () => {
    setRefreshing(true);
    const dataLists = await client.contact.getFollowerAndFollowingList(PAGE);
    if (dataLists.length === 0) {
      noMoreRef.current = true;
      setRefreshing(false);
      return;
    }
    const newData = [...followContacts, ...dataLists];
    setFollowContacts(newData);
    setRefreshing(false);
    setTimeout(async () => {
      try {
        await Promise.all(
          newData.map(async (item: any) => {
            // 通过是否存在defaultUserName和address字段来判断
            if (!item.hasOwnProperty('defaultUserName') || !item.hasOwnProperty('address')) {
              const info = await getUserInfo(item.userid, 'web3mq');
              Object.assign(item, info);
            }
          }),
        );
        setFollowContacts([...newData]);
      } catch (error) {
        
      }
    });
  };

  const loadNextPage = () => {
    if (noMoreRef.current || (followContacts.length || 0) < PAGE.size) {
      return;
    }
    PAGE.page++;
    getFollowContactsList();
  };

  const handleSearchFollContacts = useCallback(
    (value: string) => {
      setSearchFollowContacts(
        followContacts.filter((followContact) => followContact.wallet_address.indexOf(value) >= 0),
      );
    },
    [followContacts],
  );

  return {
    followContacts,
    searchFollowContacts,
    refreshing,
    getFollowContactsList,
    handleSearchFollContacts,
    setFollowContacts,
    loadNextPage,
  };
};
