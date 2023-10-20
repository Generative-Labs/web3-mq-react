import React, { useCallback, useState } from 'react';

import ss from './index.scss';
import { GroupSettingsModalTypeEnum } from '../GroupSettings';
import { useChannelStateContext, useChatContext } from '../../../context';
import { Avatar } from '../../Avatar';
import { usePaginatedMembers } from '../../AddPeople/hooks/usePaginatedMembers';
import { getShortAddress, getUserAvatar } from '../../../utils';
import { AddMembersIcon, GroupSettingsRightIcon } from '../../../icons';
import { Loading } from '../../Loading';

type MembersType = any;

type IProps = {
  className?: string;
  style?: React.CSSProperties;
  handleModalTypeChange: (type: GroupSettingsModalTypeEnum) => void;
};

export const RoomSettings: React.FC<IProps> = (props) => {
  const { handleModalTypeChange } = props;

  const [selectItem, setSelectItem] = useState<MembersType[]>([]);
  const { client } = useChatContext('MessageHeader');
  const { activeChannel } = useChannelStateContext('MessageHeader');
  const { contactList } = client.contact;
  const { memberList, memberListloading, loadMoreLoading, loadNextPage } = usePaginatedMembers(
    client,
    true,
  );
  const { chatid, chat_name, chat_type, avatar_url, avatar_base64 } = activeChannel;
  const chatName = chat_type !== 'user' ? chat_name || getShortAddress(chatid) : '';
  const avatarUrl = avatar_base64 || avatar_url || (chat_type === 'user' && '');
  const RenderList = useCallback(() => {
    if (!activeChannel || !contactList) {
      return null;
    }

    return (
      <>
        {memberListloading ? (
          <div className={ss.loadingBox}>
            <Loading />
          </div>
        ) : (
          <div className={ss.listWarp}>
            {memberList.map((item: MembersType) => (
              <div className={ss.listItem} key={item.userid}>
                <Avatar
                  size={28}
                  image={item.avatar_url || getUserAvatar(item.wallet_address) || ''}
                />
                <div className={ss.name}>
                  {item.nickname ||
                    getShortAddress(item.wallet_address) ||
                    getShortAddress(item.userid)}
                </div>
              </div>
            ))}
          </div>
        )}
      </>
    );
  }, [activeChannel, contactList, selectItem.length, memberList, memberListloading]);

  return (
    <div className={ss.roomSettingsBox}>
      <div className={ss.roomSettingItemBox}>
        <div className={ss.left}>
          <Avatar name="user1" size={48} shape="rounded" image={avatarUrl} />
        </div>
        <div className={ss.right}>{/*<GroupSettingsRightIcon />*/}</div>
      </div>
      <div className={ss.roomSettingItemBox}>
        <div className={ss.left}>Room name</div>
        <div className={ss.right}>
          <span>{chatName}</span>
          {/*<GroupSettingsRightIcon />*/}
        </div>
      </div>
      <div
        className={ss.roomSettingItemBox}
        onClick={() => {
          handleModalTypeChange(GroupSettingsModalTypeEnum.GroupManage);
        }}
      >
        <div className={ss.left}>Group management</div>
        <div className={ss.right}>
          <GroupSettingsRightIcon />
        </div>
      </div>
      <div className={ss.addMemberBox}>
        <div
          className={ss.addMemberBtn}
          onClick={() => {
            handleModalTypeChange(GroupSettingsModalTypeEnum.AddMembers);
          }}
        >
          <AddMembersIcon />
          <span>Add Members</span>
        </div>
        <RenderList />
      </div>
    </div>
  );
};
