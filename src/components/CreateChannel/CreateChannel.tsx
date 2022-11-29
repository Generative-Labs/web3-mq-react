import React, { useEffect, useState, useCallback, useMemo } from 'react';

import { ChannelSelectItem as SearchBox, SearchItemProps } from './ChannelSelectItem';
import { RadioGroup, IValueType } from '../RadioGroup';
import { toast } from '../Toast';
import { Modal } from '../Modal';

import { useChatContext } from '../../context';
import { useInput } from '../../hooks/useInput';

import { CreateChannelIcon } from '../../icons/CreateChannelIcon';

import { fileParse } from '../../utils';

import ss from './CreateChannel.scss';

export type CreateChannelProps = {
  ChannelSelectItem?: React.ComponentType<SearchItemProps>;
};

enum RadioEnum {
  addFriends = '1',
  createTopic = '2',
  subscribeTopic = '3',
  createRoom = '4',
}

const radioGroup: IValueType[] = [
  { id: RadioEnum.addFriends, name: 'addFriends' },
  // { id: RadioEnum.createTopic, name: 'createTopic' },
  // { id: RadioEnum.subscribeTopic, name: 'subscribeTopic' },
  { id: RadioEnum.createRoom, name: 'createRoom' },
];

const UnMemoizedCreateChannel = (props: CreateChannelProps) => {
  const { ChannelSelectItem = SearchBox } = props;
  const { client, appType, containerId } = useChatContext();
  const [ showCreateChannel, setShowCreateChannel ] = useState<boolean>(false);
  const [selectType, setSelectType] = useState<string>(RadioEnum.addFriends);
  const [selectFile, setSelectFile] = useState<File | undefined>(undefined);
  const { input, setValue } = useInput('');
  const { value } = input;
  // const {
  //   content,
  //   setContent,
  //   searchResult,
  //   selectedSearchUser,
  //   selectedUsers,
  //   deleteSelectUser,
  //   resetSearchUser,
  // } = useSearchUser(client);

  // useEffect(() => {
  //   if (!showCreateChannel) {
  //     resetSearchUser();
  //   }
  // }, [showCreateChannel]);

  useEffect(() => {
    if (!showCreateChannel) {
      setSelectType('1');
      setValue('');
    }
    // searchContact();
  }, [showCreateChannel]);

  const handleFileChange = useCallback(async (e) => {
    const file = e.target.files[0];
    setSelectFile(file);
  }, []);

  const handleSelectType = useCallback((item: IValueType) => {
    setSelectType(item.id);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!value && selectType !== RadioEnum.createRoom) {
      return;
    }
    if (
      (selectType === RadioEnum.subscribeTopic && value.indexOf('topic:') !== 0) ||
      (selectType === RadioEnum.addFriends && value.indexOf('user:') !== 0)
    ) {
      toast.error('Invalid format');
      return;
    }
    if (selectType === RadioEnum.addFriends) {
      await client.contact.sendFriend(value);
    }
    // if (selectType === RadioEnum.createTopic) {
    //   await client.topic.createTopic(value);
    // }
    // if (selectType === RadioEnum.subscribeTopic) {
    //   await client.topic.subscribeTopic(value);
    // }
    if (selectType === RadioEnum.createRoom) {
      let avatarUrl;
      if (selectFile) {
        const data = await fileParse(selectFile);
        avatarUrl = data.target.result;
      }
      await client.channel.createRoom({ group_name: value, avatar_base64: avatarUrl });
    }
    setShowCreateChannel(false);
  }, [value, selectType, selectFile]);

  const showLabelAndPlaceholder = useMemo(
    () => {
      if (selectType === '1') {
        return 'userid';
      } else if (selectType === '2') {
        return 'topicid';
      } else {
        return 'group name';
      }
    },
    [selectType],
  );

  const startChat = async () => {
    // if (selectedUsers.length > 0) {
    //   await client.channel.createRoom({
    //     user_ids: selectedUsers.map((item) => item.userId),
    //   });
    //   setShowCreateChannel(false);
    // }
  };

  return (
    <>
      <button
        className={ss.btn}
        onClick={() => {
          setShowCreateChannel(!showCreateChannel);
        }}
      >
        <CreateChannelIcon />
      </button>
      <Modal
        appType={appType}
        containerId={containerId}
        visible={showCreateChannel}
        dialogClassName={ss.createChannelModal}
        closeModal={() => {
          // resetSearchUser();
          setShowCreateChannel(false);
        }}
      >
        <div className={ss.createChannelContainer}>
          <div className={ss.label}>Select Type</div>
          <RadioGroup className={ss.radioGroup} value={radioGroup} onChange={handleSelectType} />
          <div className={ss.label}>{showLabelAndPlaceholder}</div>
          <input type="text" placeholder={`input ${showLabelAndPlaceholder}`} {...input} />
          {selectType === RadioEnum.createRoom && (
            <>
              <div className={ss.label}> upload avatar</div>
              <input
                type="file"
                accept="image/*"
                placeholder="select image"
                onChange={handleFileChange}
              />
            </>
          )}
          <div className={ss.submitBtn} onClick={handleSubmit}>
            Send
          </div>
          {/* <div className={ss.container}>
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
          </div> */}
          {/* <div className={ss.main}>
            <div className={ss.mainContainer}>
              {searchResult.map((user) => (
                <ChannelSelectItem
                  key={user.userId}
                  onClick={(user) => selectedSearchUser(user)}
                  user={user}
                />
              ))}
            </div>
          </div> */}
        </div>
      </Modal>
    </>
    
  );
};
export const CreateChannel = React.memo(UnMemoizedCreateChannel);
