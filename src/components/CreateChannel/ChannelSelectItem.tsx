import React from 'react';
import { Avatar } from '../Avatar';
import ss from './CreateChannel.scss';

export type SearchItemProps = {
    user: any,
    onClick?: (user:any) => void,
}

const UnMemoizedChannelSelectItem = (props: SearchItemProps) => {
  const { user, onClick } = props;
  const { userName, avatar} = user;
  return (
    <div onClick={() => onClick && onClick(user)} className={ss.searchItemContainer}>
      <div className={ss.searchItem}>
        <Avatar image={avatar}/>
        <span className={ss.name}>{userName || 'Unnamed'}</span>
      </div>
    </div>
  );
};
export const ChannelSelectItem = React.memo(UnMemoizedChannelSelectItem);