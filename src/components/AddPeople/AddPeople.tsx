import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { AddPeopleIcon, CloseBtnIcon } from '../../icons';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { useChannelStateContext } from '../../context/ChannelStateContext';
import useToggle from '../../hooks/useToggle';
import { usePaginatedMembers } from './hooks/usePaginatedMembers';
import { Avatar } from '../Avatar';
import { Modal } from '../Modal';
import { Loading } from '../Loading';

import ss from './index.scss';

type MembersType = any;

enum showModalTypeEnum {
  RoomSettings,
  AddMembers,
  EditAvatar,
  EditName,
  GroupManage,
  SelectNFTCollection,
  SelectTokens,
}

const modalTitle = {
  [showModalTypeEnum.RoomSettings]: 'Room Settings',
  [showModalTypeEnum.AddMembers]: 'Add Members',
  [showModalTypeEnum.EditAvatar]: 'Group Avatar',
  [showModalTypeEnum.EditName]: 'Group Name',
  [showModalTypeEnum.GroupManage]: 'Group management',
  [showModalTypeEnum.SelectNFTCollection]: 'NFT Collection Settings',
  [showModalTypeEnum.SelectTokens]: 'Select Token',
};

const UnMemoizedAddPeople: React.FC = () => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<MembersType[]>([]);
  const { appType, client, containerId } = useChatContext('MessageHeader');
  const { activeChannel } = useChannelStateContext('MessageHeader');
  const [showModalType, setShowModalType] = useState<showModalTypeEnum>();

  const { contactList } = client.contact;
  const visible = useMemo(() => {
    return showModalType !== undefined;
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
          setShowModalType(showModalTypeEnum.RoomSettings);
        }}
      >
        <AddPeopleIcon />
        {appType === AppTypeEnum['pc'] && <div>Add People</div>}
      </div>
      <Modal
        appType={appType}
        visible={visible}
        closeModal={resetStatus}
        containerId={containerId}
        leftBtn={
          showModalType !== showModalTypeEnum.RoomSettings ? (
            <div className={ss.inviteBtn} onClick={handleInvite}>
              invite111
            </div>
          ) : null
        }
        title={showModalType ? modalTitle[showModalType] : ''}
      >
        <div className={ss.selectMain}>
          <div className={ss.label}>To</div>
          <div className={ss.selectWarp}>
            {selectItem.map((item) => (
              <div className={ss.selectItem} key={item.userid}>
                <div className={ss.name}>{item.userid}</div>
                <CloseBtnIcon
                  style={{ fontSize: 10 }}
                  onClick={() => {
                    setSelectItem(
                      selectItem.filter((selectObj) => selectObj.userid !== item.userid),
                    );
                  }}
                />
              </div>
            ))}
            <input
              className={ss.input}
              type="text"
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
            />
          </div>
        </div>
        <div className={ss.listContainer}>
          <div className={ss.listTitle}>{isFocus ? 'contacts' : 'members'}</div>
          <RenderList />
        </div>
      </Modal>
    </div>
  );
};

export const AddPeople = React.memo(UnMemoizedAddPeople);
