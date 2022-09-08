import React, { useEffect } from 'react';

import { ChannelSelectItem as SearchBox, SearchItemProps } from './ChannelSelectItem';
import { useChatContext } from '../../context';
import { useSearchUser } from './hooks/useSearchUser';
import { Modal } from '../Modal';
import { CloseBtnIcon } from '../../icons';

import ss from './CreateChannel.scss';

export type CreateChannelProps = {
  ChannelSelectItem?: React.ComponentType<SearchItemProps>;
};
const UnMemoizedCreateChannel = (props: CreateChannelProps) => {
  const { ChannelSelectItem = SearchBox } = props;
  const { client, showCreateChannel, setShowCreateChannel, appType } = useChatContext();
  const {
    content,
    setContent,
    searchResult,
    selectedSearchUser,
    selectedUsers,
    deleteSelectUser,
    resetSearchUser,
  } = useSearchUser(client);

  useEffect(() => {
    if (!showCreateChannel) {
      resetSearchUser();
    }
  }, [showCreateChannel]);

  const startChat = async () => {
    // if (selectedUsers.length > 0) {
    //   await client.channel.createRoom({
    //     user_ids: selectedUsers.map((item) => item.userId),
    //   });
    //   setShowCreateChannel(false);
    // }
  };

  return (
    <Modal
      appType={appType}
      visible={showCreateChannel}
      closeModal={() => {
        resetSearchUser();
        setShowCreateChannel(false);
      }}
    >
      <div className={ss.createChannelContainer}>
        <div className={ss.container}>
          <div className={ss.leftBox}>
            <div className={ss.to}>To:</div>
            <div className={ss.inputContainer}>
              <div className={ss.selectedUsers}>
                {selectedUsers.map((user) => (
                  <div key={user.userId} className={ss.spanBox}>
                    <div className={ss.username}>{user.userName}</div>
                    <div className={ss.clear} onClick={() => deleteSelectUser(user)}>
                      <CloseBtnIcon style={{ fontSize: 10 }} />
                    </div>
                  </div>
                ))}
              </div>
              <input
                className={ss.inputElement}
                onChange={(e) => setContent(e.target.value)}
                value={content}
                placeholder={selectedUsers.length > 0 ? '' : 'Start typing for suggestions'}
              />
            </div>
          </div>
          <div className={ss.rightBox}>
            <button disabled={selectedUsers.length <= 0} onClick={startChat} className={ss.btn}>
              Start Chat
            </button>
          </div>
        </div>
        <div className={ss.main}>
          <div className={ss.mainContainer}>
            {searchResult.map((user) => (
              <ChannelSelectItem
                key={user.userId}
                onClick={(user) => selectedSearchUser(user)}
                user={user}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
export const CreateChannel = React.memo(UnMemoizedCreateChannel);
