import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { CloseBtnIcon, GroupSettingsIcon } from '../../icons';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { useChannelStateContext } from '../../context/ChannelStateContext';
import useToggle from '../../hooks/useToggle';
import { usePaginatedMembers } from './hooks/usePaginatedMembers';
import { Avatar } from '../Avatar';
import { Modal } from '../Modal';
import { Loading } from '../Loading';

import ss from './index.scss';
import { RoomSettings } from './RoomSettings/RoomSettings';
import { GroupManage } from './GroupManage/GroupManage';

type MembersType = any;

export enum GroupSettingsModalTypeEnum {
  RoomSettings,
  AddMembers,
  EditAvatar,
  EditName,
  GroupManage,
  SelectNFTCollection,
  SelectTokens,
}

const modalTitleMap = {
  [GroupSettingsModalTypeEnum.RoomSettings]: 'Room Settings',
  [GroupSettingsModalTypeEnum.AddMembers]: 'Add Members',
  [GroupSettingsModalTypeEnum.EditAvatar]: 'Group Avatar',
  [GroupSettingsModalTypeEnum.EditName]: 'Group Name',
  [GroupSettingsModalTypeEnum.GroupManage]: 'Group management',
  [GroupSettingsModalTypeEnum.SelectNFTCollection]: 'NFT Collection Settings',
  [GroupSettingsModalTypeEnum.SelectTokens]: 'Select Token',
};

const UnMemoizedGroupSettings: React.FC = () => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<MembersType[]>([]);
  const { appType, client, containerId } = useChatContext('MessageHeader');
  const { activeChannel } = useChannelStateContext('MessageHeader');
  const [showModalType, setShowModalType] = useState<GroupSettingsModalTypeEnum>();

  const { contactList } = client.contact;
  const visible = useMemo(() => {
    return showModalType !== undefined;
  }, [showModalType]);
  const modalTitle = useMemo(() => {
    if (showModalType === undefined) {
      return 'error title';
    } else {
      return modalTitleMap[showModalType];
    }
  }, [showModalType]);

  const hide = () => {
    setShowModalType(undefined);
  };

  const { memberList, memberListloading, loadMoreLoading, loadNextPage } = usePaginatedMembers(
    client,
    visible,
  );

  const filterContactList = useCallback((contactList: MembersType[], memberList: MembersType[]) => {
    const memberIds = memberList.map((item: MembersType) => {
      return item.userid;
    });

    return contactList.filter((item: MembersType) => !memberIds.includes(item.userid));
  }, []);

  const resetStatus = useCallback(() => {
    setLoading(false);
    hide();
    setIsFocus(false);
    setSelectItem([]);
  }, []);

  const handleInvite = useCallback(async () => {
    if (selectItem.length === 0) {
      return;
    }
    const ids = selectItem.map((member) => member.userid);
    setLoading(true);
    try {
      await client.channel.inviteGroupMember(ids);
      resetStatus();
    } catch (error) {
      setLoading(false);
    }
  }, [selectItem.length]);

  const RenderList = useCallback(() => {
    if (!activeChannel || !contactList) {
      return null;
    }

    const members = isFocus ? filterContactList(contactList, memberList) : memberList;

    return (
      <div className={ss.listWarp}>
        {members.map((item: MembersType) => (
          <div
            className={ss.listItem}
            key={item.userid}
            onClick={() => {
              if (isFocus && !selectItem.includes(item)) {
                setSelectItem([...selectItem, item]);
              }
            }}
          >
            <Avatar image={item.avatar} />
            <div className={ss.name}>{item.userid}</div>
          </div>
        ))}
      </div>
    );
  }, [activeChannel, contactList, isFocus, selectItem.length, memberList]);

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
        leftBtn={
          showModalType !== GroupSettingsModalTypeEnum.RoomSettings ? (
            <div className={ss.inviteBtn} onClick={handleInvite}>
              invite111
            </div>
          ) : null
        }
        title={modalTitle}
        dialogClassName={ss.groupSettingDialogClassName}
      >
        {showModalType === GroupSettingsModalTypeEnum.RoomSettings && (
          <RoomSettings handleModalTypeChange={setShowModalType} />
        )}
        {showModalType === GroupSettingsModalTypeEnum.GroupManage && (
          <GroupManage handleModalTypeChange={setShowModalType} />
        )}

        {/*<div className={ss.selectMain}>*/}
        {/*  <div className={ss.label}>To</div>*/}
        {/*  <div className={ss.selectWarp}>*/}
        {/*    {selectItem.map((item) => (*/}
        {/*      <div className={ss.selectItem} key={item.userid}>*/}
        {/*        <div className={ss.name}>{item.userid}</div>*/}
        {/*        <CloseBtnIcon*/}
        {/*          style={{ fontSize: 10 }}*/}
        {/*          onClick={() => {*/}
        {/*            setSelectItem(*/}
        {/*              selectItem.filter((selectObj) => selectObj.userid !== item.userid),*/}
        {/*            );*/}
        {/*          }}*/}
        {/*        />*/}
        {/*      </div>*/}
        {/*    ))}*/}
        {/*    <input*/}
        {/*      className={ss.input}*/}
        {/*      type="text"*/}
        {/*      onFocus={() => setIsFocus(true)}*/}
        {/*      // onBlur={() => setIsFocus(false)}*/}
        {/*    />*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<div className={ss.listContainer}>*/}
        {/*  <div className={ss.listTitle}>{isFocus ? 'contacts' : 'members'}</div>*/}
        {/*  <RenderList />*/}
        {/*</div>*/}
      </Modal>
    </div>
  );
};

export const GroupSettings = React.memo(UnMemoizedGroupSettings);
