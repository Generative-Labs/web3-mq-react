import React from 'react';

import { useFollowing } from './hooks/useFollowing';

import { Empty } from '../Empty';
import { FollowPreview, FollowPreviewProps } from '../FollowPreview';
import { ContactListMessenger, ContactListMessengerProps } from '../ContactList/ContactListMessenger';

import { ChatsIcon } from '../../icons';
import { useChatContext } from '../../context';
import { getShortAddress, getUserAvatar } from '../../utils';

export type FollowerListProps = {
  List?: React.ComponentType<ContactListMessengerProps>;
  Follower?: React.ComponentType<FollowPreviewProps>;
}

export const FollowingList: React.FC<FollowerListProps> = (props) => {
  const {
    List = ContactListMessenger,
    Follower = FollowPreview,
  } = props;
  const { client } = useChatContext();
  const { followings, status } = useFollowing(client);

  const renderFollowing = (item: any) => {
    const props = {
      ...item,
      defaultUserName: getShortAddress(item.wallet_address),
      defaultUserAvatar: getUserAvatar(item.wallet_address),
      client: client,
      type: 'following'
    };
    return (
      <Follower key={item.userid} { ...props } />
    );
  };

  return (
    <List loading={status.loading} error={status.error} listRef={null as any}>
      {followings.length === 0 ? (
        <Empty 
          description='Your contact list is empty'
          icon={<ChatsIcon />}
        />
      ) : (
        followings.map(renderFollowing)
      )}
    </List>
  );
};