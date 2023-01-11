import React, { useState } from 'react';
import type { Client } from 'web3-mq';
import { Avatar } from '../Avatar';
import { Button } from '../Button';

import ss from './index.scss';

export type FollowPreviewProps = {
  avatar_url: string;
  client: Client
  defaultUserName: string;
  defaultUserAvatar: string;
  follow_status: string;
  nickname: string;
  permissions?: any;
  type?: 'follower' | 'following'
  userid: string;
  wallet_address?: string;
  wallet_type?: string;
}
export const FollowPreview: React.FC<FollowPreviewProps> = (props) => {
  const { 
    avatar_url, 
    client, 
    defaultUserAvatar, 
    defaultUserName, 
    follow_status, 
    nickname, 
    type = 'follower',
    userid 
  } = props;
  const [ followStatus, setFollowStatus ] = useState<string>(follow_status);
  const handleFollow = async (status: string) => {
    if (status === 'follow_each' || type === 'following') {
      await client.user.followOperation({
        target_userid: userid,
        action: 'cancel'
      });
      setFollowStatus('following');
    } else if (status === 'following') {
      await client.user.followOperation({
        target_userid: userid,
        action: 'follow'
      });
      setFollowStatus('follow_each');
    };
  };

  return (
    <div className={ss.followPreviewContainer}>
      <Avatar size={40} image={avatar_url || defaultUserAvatar} />
      <div className={ss.rightContent}>
        <div className={ss.wrapper}>
          <div>{nickname || defaultUserName}</div>
          {type === 'follower' && <div>Follows you</div>}
        </div>
        <Button 
          onClick={() => handleFollow(followStatus)} 
          type={followStatus === 'follow_each' ? 'default' : 'primary'}
        >
          {followStatus === 'follow_each' ? 'following' : 'follow'}
        </Button>
      </div>
    </div>
  );
};