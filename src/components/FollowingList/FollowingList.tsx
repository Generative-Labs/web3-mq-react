import React, { useEffect, useRef } from 'react';
import { useFollowing } from './hooks/usePaginatedFollowings';

import type { CommonUserInfoType } from '../Chat/hooks/useQueryUserInfo';
import { ContactListMessenger, ContactListMessengerProps } from '../ContactList/ContactListMessenger';
import { Empty, EmptyProps } from '../Empty';
import { FollowPreview, FollowPreviewProps } from '../FollowPreview';
import { Paginator } from '../Paginator';

import { ChatsIcon } from '../../icons';
import { useChatContext } from '../../context';

export type FollowerListProps = {
  List?: React.ComponentType<ContactListMessengerProps>;
  DefaultEmpty?: React.ComponentType<EmptyProps>;
  Follower?: React.ComponentType<FollowPreviewProps>;
}

export const FollowingList: React.FC<FollowerListProps> = (props) => {
  const {
    List = ContactListMessenger,
    DefaultEmpty = Empty,
    Follower = FollowPreview,
  } = props;
  const listRef = useRef<HTMLDivElement | null>(null);
  const { client, loginUserInfo, getUserInfo } = useChatContext();
  const { 
    followings, 
    refreshing, 
    status, 
    handleEvent, 
    handleFollowOrUnFollow,
    loadNextPage 
  } = useFollowing({
    client,
    loginUserInfo: loginUserInfo as CommonUserInfoType,
    getUserInfo
  });

  useEffect(() => {
    client.on('contact.getFollowingList', handleEvent);
    return () => {
      client.off('contact.getFollowingList', handleEvent);
    };
  }, []);

  const renderFollowing = (item: any) => {
    const props = {
      follow: item,
      client: client,
      handleFollowOrUnFollow,
    };
    return (
      <Follower key={item.userid} { ...props } />
    );
  };

  return (
    <List loading={status.loading} error={status.error} listRef={null as any}>
      {followings.length === 0 ? (
        <DefaultEmpty
          description='Your contact list is empty'
          icon={<ChatsIcon />}
        />
      ) : (
        <Paginator element={listRef} showLoading={refreshing} loadNextPage={loadNextPage}>
          {followings.map(renderFollowing)}
        </Paginator>
      )}
    </List>
  );
};