import React, { useState } from 'react';
import type { Client } from 'web3-mq';

import { AddFriends } from '../CreateChannel/AddFriends';
import { Modal } from '../Modal';
import { Button } from '../Button';

import { useChatContext } from '../../context';
import useToggle from '../../hooks/useToggle';
import { ExclamationCircleIcon } from '../../icons';

import ss from './index.scss';

type FollowRequestButtonGroupProps = {
  client: Client;
  containerId?: string;
  warnText?: string,
  showFollow?: boolean,
  showBlockBtn?: boolean,
  userId?: string,
  onFollow?: () => void;
  onCancel?: () => void;
}
const timeIdObject: Record<string, NodeJS.Timeout> = {};

export const FollowRequestButtonGroup: React.FC<FollowRequestButtonGroupProps> = (props) => {
  const { 
    client,
    containerId = '',
    warnText,
    showFollow = false,
    showBlockBtn = false,
    userId = '',
    onCancel,
    onFollow,
  } = props;
  const { loginUserInfo } = useChatContext();
  const { visible, show, hide } = useToggle(false);
  const [isFollow, setIsFollow] = useState<boolean>(false);
  const [isRequest, setIsRequest] = useState<boolean>(false);
  
  const handleFollow = async (callback?: () => void) => {
    try {
      if (loginUserInfo) {
        await client.user.followOperation({
          target_userid: userId,
          action: 'follow',
          address: loginUserInfo.address,
          did_type: loginUserInfo.wallet_type as any
        });
        setIsFollow(true);
        callback && callback();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollowOrRequest = async (type: boolean) => {
    if (type) {
      try {
        await handleFollow(onFollow);
      } catch (error) {
        console.log(error);
      }
    } else {
      show();
    }
  };
  const handleCancel = () => {
    onCancel && onCancel();
  };
  const addFriendCallback = () => {
    if (userId) {
      timeIdObject[userId] && clearTimeout(timeIdObject[userId]);
      hide();
      setIsRequest(true);
      timeIdObject[userId] = setTimeout(() => {
        setIsRequest(false);
      }, 60000);
    }
  };

  return (
    <div className={ss.operateFollowRequestBar}>
      {warnText && (
        <div className={ss.warning}>
          <ExclamationCircleIcon className={ss.warnIcon} />{warnText}
        </div>
      )}
      {userId && (
        <>
          {showBlockBtn && !showFollow && 
            <Button 
              block
              disabled={isFollow}
              size='large' 
              style={{marginBottom: '16px'}} 
              type='primary'
              onClick={() => handleFollow()}
            >
              {!isFollow ? 'Follow' : 'Following'}
            </Button>
          }
          <Button className={ss.cancelBtn} size='large' onClick={handleCancel}>Cancel</Button>
          <Button 
            className={ss.operateBtn}
            disabled={showFollow ? isFollow : isRequest} 
            size='large' 
            type={showBlockBtn ? 'ghost' : 'primary'} 
            onClick={() => handleFollowOrRequest(showFollow)}
          >
            {showFollow ? !isFollow ? 'Follow' : 'Following' : !isRequest ? 'Request' : 'Requesting'}
          </Button>
        </>
      )}
      <Modal
        containerId={containerId}
        dialogClassName={ss.dialogContent}
        title='Request'
        visible={visible}
        closeModal={hide}
      >
        <AddFriends 
          client={client}
          disabled={true}
          userId={userId}
          onSubmit={addFriendCallback} 
        />
      </Modal>
    </div>
  );
};