import React, { useEffect, useRef } from 'react';

import { useFollower } from './hooks/usePaginatedFollowers';

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
export const FollowerList: React.FC<FollowerListProps> = (props) => {
  const {
    List = ContactListMessenger,
    DefaultEmpty = Empty,
    Follower = FollowPreview,
  } = props;
  const listRef = useRef<HTMLDivElement | null>(null);
  const { client, loginUserInfo, getUserInfo } = useChatContext();
  const { 
    followers, 
    refreshing, 
    status, 
    handleEvent,
    handleFollowOrUnFollow, 
    loadNextPage
  } = useFollower({
    client, 
    loginUserInfo: loginUserInfo as CommonUserInfoType,
    getUserInfo
  });
  
  useEffect(() => {
    client.on('contact.getFollowerList', handleEvent);
    return () => {
      client.off('contact.getFollowerList', handleEvent);
    };
  }, []);

  const renderFollower = (item: any) => {
    const props = {
      follow: item,
      client: client,
      handleFollowOrUnFollow
    };
    return (
      <Follower key={item.userid} { ...props } />
    );
  };

  return (
    <List loading={status.loading} error={status.error} listRef={null as any}>
      {followers.length === 0 ? (
        <DefaultEmpty 
          description='Your contact list is empty'
          icon={<ChatsIcon />}
        />
      ) : (
        <Paginator element={listRef} showLoading={refreshing} loadNextPage={loadNextPage}>
          {followers.map(renderFollower)}
        </Paginator>
      )}
    </List>
  );
};