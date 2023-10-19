import React, { useCallback, useState } from 'react';

import ss from './index.scss';
import type { GroupSettingsModalTypeEnum } from '../GroupSettings';
import { useChannelStateContext, useChatContext } from '../../../context';
import { Avatar } from '../../Avatar';
import { usePaginatedMembers } from '../../AddPeople/hooks/usePaginatedMembers';
import { getShortAddress } from '../../../utils';
import { GroupSettingsRightIcon } from '../../../icons';

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
    <div className={ss.roomSettingsBox}>
      <div className={ss.avatarBox}>
        <Avatar name="user1" size={40} shape="rounded" image={avatarUrl} />
      </div>
      <div className={ss.roomNameBox}>
        <div>Room name</div>
        <div>{chatName}</div>
      </div>
      <div className={ss.groupManageBtn}>
        Group management
        <div className={ss.rightBtn}>
          <GroupSettingsRightIcon />
        </div>
      </div>

      <div className={ss.listContainer}>
        <div className={ss.listTitle}>{isFocus ? 'contacts' : 'members'}</div>
        <RenderList />
      </div>
    </div>
  );
};
