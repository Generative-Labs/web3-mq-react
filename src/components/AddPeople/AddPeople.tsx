import React, { useCallback, useState } from 'react';

import { AddPeopleIcon, CloseBtnIcon } from '../../icons';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { useChannelStateContext } from '../../context/ChannelStateContext';
import useToggle from '../../hooks/useToggle';

import { Avatar } from '../Avatar';
import { Modal } from '../Modal';
import { Loading } from '../Loading';

import ss from './index.scss';

type MembersType = any;

const UnMemoizedAddPeople: React.FC = () => {
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<MembersType[]>([]);
  const { appType, client } = useChatContext('MessageHeader');
  const { activeChannel } = useChannelStateContext('MessageHeader');
  const { visible, show, hide } = useToggle();

  const { contactList } = client.contact;

  const filterContactList = useCallback((contactList, chatRoomMember) => {
    const memberIds = chatRoomMember.map((item: MembersType) => {
      return item.user_id;
    });

    return contactList.filter((item: MembersType) => !memberIds.includes(item.user_id));
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
    const ids = selectItem.map((member) => member.user_id);
    setLoading(true);
    try {
      // await client.channel.addMembers(ids);
      resetStatus();
    } catch (error) {
      setLoading(false);
    }
  }, [selectItem.length]);

  const RenderList = useCallback(() => {
    if (!activeChannel || !contactList) {
      return null;
    }

    const { members: chatRoomMember } = activeChannel;
    const members = isFocus ? filterContactList(contactList, chatRoomMember) : chatRoomMember;

    return (
      <div className={ss.listWarp}>
        {members.map((item: MembersType) => (
          <div
            className={ss.listItem}
            key={item.user_id}
            onClick={() => {
              if (isFocus && !selectItem.includes(item)) {
                setSelectItem([...selectItem, item]);
              }
            }}
          >
            <Avatar image={item.avatar} />
            <div className={ss.name}>{item.user_name}</div>
          </div>
        ))}
      </div>
    );
  }, [activeChannel, contactList, isFocus, selectItem.length]);

  return (
    <div className={ss.addPeopleContainer}>
      <div className={ss.icon} onClick={show}>
        <AddPeopleIcon />
        {appType === AppTypeEnum['pc'] && <span>Add People</span>}
      </div>
      <Modal
        appType={appType}
        visible={visible}
        closeModal={resetStatus}
        rightBtn={
          loading ? (
            <Loading />
          ) : (
            <div className={ss.inviteBtn} onClick={handleInvite}>
              invite
            </div>
          )
        }
        title={isFocus ? 'New Group Chat' : 'Room Members'}
      >
        <div className={ss.selectMain}>
          <div className={ss.label}>To</div>
          <div className={ss.selectWarp}>
            {selectItem.map((item) => (
              <div className={ss.selectItem} key={item.user_id}>
                <div className={ss.name}>{item.user_name}</div>
                <CloseBtnIcon
                  style={{ fontSize: 10 }}
                  onClick={() => {
                    setSelectItem(
                      selectItem.filter((selectObj) => selectObj.user_name !== item.user_name),
                    );
                  }}
                />
              </div>
            ))}
            <input
              className={ss.input}
              type="text"
              onFocus={() => setIsFocus(true)}
              //   onBlur={() => setIsFocus(false)}
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
