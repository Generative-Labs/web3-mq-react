import React from 'react';

import { useFollower } from './hooks/userFollower';

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
export const FollowerList: React.FC<FollowerListProps> = (props) => {
  const {
    List = ContactListMessenger,
    Follower = FollowPreview,
  } = props;
  const { client } = useChatContext();
  const { followers, status } = useFollower(client);
  

  const renderFollower = (item: any) => {
    const props = {
      ...item,
      defaultUserName: getShortAddress(item.wallet_address),
      defaultUserAvatar: getUserAvatar(item.wallet_address),
      client: client,
    };
    return (
      <Follower key={item.userid} { ...props } />
    );
  };

  return (
    <List loading={status.loading} error={status.error} listRef={null as any}>
      {followers.length === 0 ? (
        <Empty 
          description='Your contact list is empty'
          icon={<ChatsIcon />}
        />
      ) : (
        followers.map(renderFollower)
      )}
    </List>
  );
};