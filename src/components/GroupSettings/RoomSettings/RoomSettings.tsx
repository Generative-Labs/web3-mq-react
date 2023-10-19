import React, { useCallback, useState } from 'react';

import ss from './index.scss';
import { GroupSettingsModalTypeEnum } from '../GroupSettings';
import { useChannelStateContext, useChatContext } from '../../../context';
import { Avatar } from '../../Avatar';
import { usePaginatedMembers } from '../../AddPeople/hooks/usePaginatedMembers';
import {getShortAddress, getUserAvatar} from '../../../utils';
import { GroupSettingsRightIcon, AddMembersIcon } from '../../../icons';

type MembersType = any;

type IProps = {
  className?: string;
  style?: React.CSSProperties;
  handleModalTypeChange: (type: GroupSettingsModalTypeEnum) => void;
};

export const RoomSettings: React.FC<IProps> = (props) => {
  const { handleModalTypeChange } = props;

  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<MembersType[]>([]);
  const { appType, client, containerId } = useChatContext('MessageHeader');
  const { activeChannel } = useChannelStateContext('MessageHeader');
  const { contactList } = client.contact;
  const { memberList, memberListloading, loadMoreLoading, loadNextPage } = usePaginatedMembers(
    client,
    true,
  );
  const {
    chatid,
    chat_name,
    chat_type,
    avatar_url,
    avatar_base64,
    unread,
    lastMessage,
    updatedAt,
  } = activeChannel;
  const chatName = chat_type !== 'user' ? chat_name || getShortAddress(chatid) : '';
  const avatarUrl = avatar_base64 || avatar_url || (chat_type === 'user' && '');

  const filterContactList = useCallback((contactList: MembersType[], memberList: MembersType[]) => {
    const memberIds = memberList.map((item: MembersType) => {
      return item.userid;
    });

    return contactList.filter((item: MembersType) => !memberIds.includes(item.userid));
  }, []);

  const RenderList = useCallback(() => {
    if (!activeChannel || !contactList) {
      return null;
    }
    const members = isFocus ? filterContactList(contactList, memberList) : memberList;
    console.log(members, 'members');

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
            <Avatar size={28} image={item.avatar_url || getUserAvatar(item.wallet_address) || ''} />
            <div className={ss.name}>{  item.nickname || getShortAddress(item.wallet_address) || getShortAddress(item.userid) }</div>
          </div>
        ))}
      </div>
    );
  }, [activeChannel, contactList, isFocus, selectItem.length, memberList]);

  return (
    <div className={ss.roomSettingsBox}>
      <div className={ss.roomSettingItemBox}>
        <div className={ss.left}>
          <Avatar name="user1" size={40} shape="rounded" image={avatarUrl} />
        </div>
        <div className={ss.right}>
          <GroupSettingsRightIcon />
        </div>
      </div>
      <div className={ss.roomSettingItemBox}>
        <div className={ss.left}>Room name</div>
        <div className={ss.right}>
          <span>{chatName}</span>
          <GroupSettingsRightIcon />
        </div>
      </div>
      <div className={ss.roomSettingItemBox} onClick={() => {
        handleModalTypeChange(GroupSettingsModalTypeEnum.GroupManage);
      }}>
        <div className={ss.left}>Group management</div>
        <div className={ss.right}>
          <GroupSettingsRightIcon />
        </div>
      </div>
      <div className={ss.addMemberBox}>
        <div className={ss.addMemberBtn}>
          <AddMembersIcon /><span>Add Members</span>
        </div>
        <RenderList />
      </div>
    </div>
  );
};
