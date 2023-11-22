import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BackIcon, ConnectErrorIcon, GroupSettingsIcon, SuccessIcon } from '../../icons';
import { useChatContext } from '../../context/ChatContext';
import { Modal } from '../Modal';

import ss from './index.scss';
import { RoomSettings } from './RoomSettings';
import { PermissionSettings } from './PermissionSettings';
import { AddMember } from './AddMember';
import { SelectNFTCollection } from './SelectNFTCollection';
import { CommonCenterStatus, CommonCenterStatusIProp } from '../LoginModal/loginLoading';

export enum GroupSettingsModalTypeEnum {
  RoomSettings,
  AddMembers,
  EditAvatar,
  EditName,
  GroupManage,
  SelectNFTCollection,
  SelectTokens,
  Error,
  Success,
}

const modalTitleMap = {
  [GroupSettingsModalTypeEnum.RoomSettings]: 'Room Settings',
  [GroupSettingsModalTypeEnum.AddMembers]: 'Add Members',
  [GroupSettingsModalTypeEnum.EditAvatar]: 'Group Avatar',
  [GroupSettingsModalTypeEnum.EditName]: 'Group Name',
  [GroupSettingsModalTypeEnum.GroupManage]: 'Group management',
  [GroupSettingsModalTypeEnum.SelectNFTCollection]: 'NFT Collection Settings',
  [GroupSettingsModalTypeEnum.SelectTokens]: 'Select Token',
  [GroupSettingsModalTypeEnum.Error]: 'Error',
  [GroupSettingsModalTypeEnum.Success]: 'Success',
};

const UnMemoizedGroupSettings: React.FC = () => {
  const { appType, containerId } = useChatContext('MessageHeader');
  const [showModalType, setShowModalType] = useState<GroupSettingsModalTypeEnum>();
  const [errorMessage, setErrorMessage] = useState('');

  const visible = useMemo(() => {
    return showModalType !== undefined;
  }, [showModalType]);
  const modalTitle = useMemo(() => {
    if (showModalType === undefined) {
      return '';
    } else {
      return modalTitleMap[showModalType];
    }
  }, [showModalType]);

  useEffect(() => {
    if (showModalType === GroupSettingsModalTypeEnum.Success) {
      setTimeout(() => {
        setShowModalType(undefined);
      }, 1000);
    }
  }, [showModalType]);

  const resetStatus = useCallback(() => {
    setShowModalType(undefined);
  }, []);

  const handleBack = () => {
    if (
      showModalType === GroupSettingsModalTypeEnum.SelectNFTCollection ||
      showModalType === GroupSettingsModalTypeEnum.SelectTokens
    ) {
      setShowModalType(GroupSettingsModalTypeEnum.GroupManage);
    } else {
      setShowModalType(GroupSettingsModalTypeEnum.RoomSettings);
    }
  };

  const RenderLeftBtn = useCallback(() => {
    if (
      showModalType === GroupSettingsModalTypeEnum.RoomSettings ||
      showModalType === GroupSettingsModalTypeEnum.Success
    ) {
      return null;
    }
    return (
      <div className={ss.inviteBtn} onClick={handleBack}>
        <BackIcon />
      </div>
    );
  }, [handleBack, showModalType]);

  return (
    <div className={ss.addPeopleContainer}>
      <div
        className={ss.icon}
        onClick={() => {
          setShowModalType(GroupSettingsModalTypeEnum.RoomSettings);
        }}
      >
        <GroupSettingsIcon />
      </div>
      <Modal
        appType={appType}
        visible={visible}
        closeModal={resetStatus}
        containerId={containerId}
        leftBtn={<RenderLeftBtn />}
        title={modalTitle}
        dialogClassName={
          !showModalType ||
          ![
            GroupSettingsModalTypeEnum.SelectNFTCollection,
            GroupSettingsModalTypeEnum.Success,
            GroupSettingsModalTypeEnum.AddMembers,
          ].includes(showModalType)
            ? ss.groupSettingGrayDialogClassName
            : showModalType === GroupSettingsModalTypeEnum.AddMembers
              ? ss.groupSettingDialogClassName
              : null
        }
      >
        {showModalType === GroupSettingsModalTypeEnum.RoomSettings && (
          <RoomSettings handleModalTypeChange={setShowModalType} />
        )}
        {showModalType === GroupSettingsModalTypeEnum.GroupManage && (
          <PermissionSettings
            handleSetMsgChange={setErrorMessage}
            handleModalTypeChange={setShowModalType}
          />
        )}
        {showModalType === GroupSettingsModalTypeEnum.Error && (
          <div style={{ padding: '16px' }}>
            <CommonCenterStatus
              {...{
                styles: {},
                icon: <ConnectErrorIcon />,
                title: 'Operation failed!',
                textContent: errorMessage || 'The operation failed!',
                showBtn: true,
                btnText: 'Try Again',
                handleBtnClick: () => {
                  setErrorMessage('');
                  setShowModalType(GroupSettingsModalTypeEnum.RoomSettings);
                },
              }}
            />
          </div>
        )}
        {showModalType === GroupSettingsModalTypeEnum.SelectNFTCollection && (
          <SelectNFTCollection
            handleModalTypeChange={setShowModalType}
            handleSetMsgChange={setErrorMessage}
          />
        )}
        {showModalType === GroupSettingsModalTypeEnum.Success && (
          <div style={{ padding: '16px' }}>
            <CommonCenterStatus
              {...{
                styles: {},
                icon: <SuccessIcon />,
                title: 'Successful!',
                textContent: errorMessage || 'The operation successful!',
                showBtn: false,
              }}
            />
          </div>
        )}
        {showModalType === GroupSettingsModalTypeEnum.AddMembers && (
          <AddMember setErrorMessage={setErrorMessage} handleModalTypeChange={setShowModalType} />
        )}
      </Modal>
    </div>
  );
};

export const GroupSettings = React.memo(UnMemoizedGroupSettings);
