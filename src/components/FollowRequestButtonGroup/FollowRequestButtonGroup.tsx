import React, { useState } from 'react';
import type { Client } from '@web3mq/client';

import { AddFriends } from '../CreateChannel/AddFriends';
import { Modal } from '../Modal';
import { Button } from '../Button';

import { useChatContext } from '../../context';
import useToggle from '../../hooks/useToggle';
import { ExclamationCircleIcon } from '../../icons';

import ss from './index.scss';
import type { UserPermissionsType } from '../MessageConsole/hooks/useOperatePermissions';
import { RelationAuditMaps, RelationEnum } from '../MessageConsole/hooks/useOperatePermissions';

type FollowRequestButtonGroupProps = {
  client: Client;
  containerId?: string;
  followDisabled?: boolean;
  warnText?: string;
  showFollow?: boolean;
  showBlockBtn?: boolean;
  userId?: string;
  targetUserPermission: UserPermissionsType;
  toChatTargetUser: RelationEnum;
  onFollow?: (isCanMessage?: boolean) => void;
  onAddFriendCallback?: () => void;
  onCancel?: () => void;
};
const timeIdObject: Record<string, NodeJS.Timeout> = {};

export const FollowRequestButtonGroup: React.FC<FollowRequestButtonGroupProps> = (props) => {
  const {
    client,
    containerId = '',
    warnText,
    onAddFriendCallback,
    userId = '',
    onCancel,
    onFollow,
    toChatTargetUser,
  } = props;
  const { loginUserInfo, setActiveNotification, setShowListTypeView } = useChatContext();
  const { visible, show, hide } = useToggle(false);
  const [isRequest, setIsRequest] = useState(false);

  const handleFollow = async (isCanMessage?: boolean) => {
    try {
      if (loginUserInfo) {
        await client.contact.followOperation({
          targetUserid: userId,
          action: 'follow',
          address: loginUserInfo.address,
          didType: loginUserInfo.wallet_type as any,
        });
        onFollow && onFollow(isCanMessage);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleCancel = () => {
    onCancel && onCancel();
  };
  const addFriendCallback = () => {
    if (userId) {
      hide();
      setIsRequest(true);
      setTimeout(() => {
        onAddFriendCallback && onAddFriendCallback();
      }, 1000);
    }
  };
  const handleClick = async () => {
    if (toChatTargetUser === RelationEnum.both) {
      await handleFollow(false);
      return;
    }

    if (toChatTargetUser === RelationEnum.needFollow) {
      await handleFollow(true);
      return;
    }

    if (toChatTargetUser === RelationEnum.needRequestFriend) {
      await show();
      return;
    }
  };

  return (
    <div className={ss.operateFollowRequestBar}>
      {warnText && (
        <div className={ss.warning}>
          <ExclamationCircleIcon className={ss.warnIcon} />
          {warnText}
        </div>
      )}
      {userId && (
        <>
          <Button className={ss.cancelBtn} size="large" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={isRequest}
            className={ss.operateBtn}
            size="large"
            type={'primary'}
            onClick={handleClick}
          >
            {RelationAuditMaps[toChatTargetUser]}
          </Button>
        </>
      )}
      <Modal
        containerId={containerId}
        dialogClassName={ss.dialogContent}
        title="Request"
        visible={visible}
        closeModal={hide}
      >
        <AddFriends client={client} disabled={true} userId={userId} onSubmit={addFriendCallback} />
      </Modal>
    </div>
  );
};
