import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import type { Client, ContactListItemType } from '@web3mq/client';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { Modal } from '../Modal';

import type { FollowerListItemType } from '../FollowerList/hooks/usePaginatedFollowers';
import type { FollowingListItemType } from '../FollowingList/hooks/usePaginatedFollowings';

import { useChatContext, AppTypeEnum } from '../../context';
import { CloseBtnIcon } from '../../icons';
import { getShortAddress, getUserAvatar } from '../../utils';

import ss from './index.scss';

export type FollowPreviewProps = {
  follow: FollowerListItemType | FollowingListItemType,
  handleFollowOrUnFollow?: (follow: FollowerListItemType | FollowingListItemType) => Promise<void>;
}
export const FollowPreview: React.FC<FollowPreviewProps> = (props) => {
  const { 
    follow,
    handleFollowOrUnFollow,
  } = props;
  const { containerId, appType } = useChatContext('FollowPreview');
  const { avatar_url, nickname, follow_status, defaultUserAvatar, defaultUserName, wallet_address } = follow;
  const [visible, setVisible] = useState<boolean>(false);
  const [btnLoad, setBtnLoad] = useState<boolean>(false);
  const onFollowOrUnfollow = async (follow: FollowerListItemType | FollowingListItemType) => {
    handleFollowOrUnFollow && await handleFollowOrUnFollow(follow);
  };

  const handleClick = async () => {
    // to unfollow
    if (follow.follow_status === 'follow_each' || follow.follow_status === 'following') {
      setVisible(true);
    } else {
      setBtnLoad(true);
      await onFollowOrUnfollow(follow).finally(() => {
        setBtnLoad(false);
      });
    }
  };

  const handleUnFollow = async () => {
    setBtnLoad(true);
    await onFollowOrUnfollow(follow).finally(() => {
      setBtnLoad(false);
    });
    setVisible(false);
  };

  const ModalHeader = useCallback(() => (
    <div className={ss.unFollowModalHeader}>
      <div className={ss.title}>Unfollow {nickname || defaultUserName || getShortAddress(wallet_address)}</div>
      <CloseBtnIcon onClick={() => setVisible(false)} className={ss.closeBtn} />
    </div>
  ), [follow]);

  return (
    <div className={ss.followPreviewContainer}>
      <Avatar size={40} image={avatar_url || defaultUserAvatar || getUserAvatar(wallet_address)} />
      <div className={ss.rightContent}>
        <div className={ss.wrapper}>
          <div>{nickname || defaultUserName || getShortAddress(wallet_address)}</div>
          {(follow_status === 'follower' || follow_status === 'follow_each') && <div>Follows you</div>}
        </div>
        <Button 
          onClick={handleClick} 
          disabled={btnLoad}
          type={follow_status === 'follower' ? 'primary' : 'default'}
        >
          {follow_status === 'follower' ? 'follow' : 'following'}
        </Button>
      </div>
      <Modal
        visible={visible}
        dialogClassName={cx(ss.unFollowModalContainer, {
          [ss.mobileStyle]: appType !== AppTypeEnum['pc']
        })}
        containerId={containerId}
        closeModal={() => setVisible(false)}
        modalHeader={<ModalHeader />}
      >
        <div className={ss.unFollowDescription}>Are you sure to unfollow？</div>
        <div className={ss.buttonGroupContainer}>
          <Button block size='large' onClick={() =>  setVisible(false)} style={{marginRight: '10px'}}>Cancel</Button>
          <Button block disabled={btnLoad} type='danger' size='large' onClick={handleUnFollow}>UnFollow</Button>
        </div>
      </Modal>
    </div>
  );
};