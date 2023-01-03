import React, { useCallback, useEffect, useState } from 'react';

import useToggle from '../../hooks/useToggle';
import { useInput } from '../../hooks/useInput';
import { useChatContext } from '../../context/ChatContext';
import { BulkMessageIcon, CloseBtnIcon } from '../../icons';
import { Modal } from '../Modal';
import { SelectTopic } from './SelectTopic';
import { Button, ButtonSize, ButtonType } from '../Button';
import { IValueType, RadioGroup } from '../RadioGroup';

import ss from './index.scss';

enum RadioEnum {
  // all = '1',
  // chat = '2',
  notification = '1',
}

const radioGroup: IValueType[] = [
  // { id: RadioEnum.all, name: 'All' },
  // { id: RadioEnum.chat, name: 'Chat' },
  { id: RadioEnum.notification, name: 'Notification' },
];

export const Notify = () => {
  const { client, appType, containerId } = useChatContext('Notify');
  const [topics, setTopics] = useState<string[]>([]);
  const [via, setVia] = useState<string>(RadioEnum.notification);
  const [title, setTitle] = useState<string>('');
  const { visible, show, hide } = useToggle();
  const { input, setValue } = useInput('');
  const { value } = input;

  useEffect(() => {
    if (!visible) {
      setTopics([]);
      setVia('1');
      setValue('');
    }
  }, [visible]);

  const handleSelectTopic = useCallback((item: any[]) => {
    const ids = item.map((topic) => topic.topicid);
    setTopics(ids);
  }, []);

  const handleSelectVia = useCallback((item: IValueType) => {
    setVia(item.id);
  }, []);

  const handleSubmitChat = async () => {
    for (let i = 0; i < topics.length; i++) {
      let user_id = topics[i];
      // let { roomId, existRoomInfo } = await client.channel.getRoomByBulk({
      //   user_id: user_id,
      // });
      // if (roomId) {
      //   client.messages.sendMessageByBulk(value, roomId);
      // }
    }
  };

  const handleSubmit = useCallback(async () => {
    if (topics.length === 0 || !value) {
      return;
    }
    if (via === RadioEnum.notification) {
      await client.topic.publishTopicMessage({ topicid: topics[0], title: title, content: value });
    }
    // if (via === RadioEnum.chat) {
    //   await handleSubmitChat();
    // }
    // if (via === RadioEnum.all) {
    //   handleSubmitChat();
    //   await client.notify.sendNotify({ ids: users, text: value });
    // }
    hide();
  }, [via, topics, value]);

  const ModalHead = useCallback(
    () => (
      <div className={ss.modalHead}>
        <div className={ss.title}>Bulk messaging</div>
        <CloseBtnIcon onClick={hide} className={ss.closeBtn} />
      </div>
    ),
    [],
  );

  return (
    <div className={ss.notifyContainer}>
      <div className={ss.modalBtn} onClick={show}>
        <BulkMessageIcon className={ss.icon} />
        <div className={ss.title}>
          <div>Bulk</div>
          <div>messaging</div>
        </div>
      </div>
      <Modal appType={appType} containerId={containerId} visible={visible} closeModal={hide} modalHeader={<ModalHead />} >
        <div className={ss.modalBody}>
          <div className={ss.title}>
            Sending a message to multiple contacts or group chats at the same time
          </div>
          <div className={ss.label}>Send to</div>
          <SelectTopic onChange={handleSelectTopic} />
          <div className={ss.label}>Title</div>
          <input placeholder="Write something..." value={title} onChange={(e) => setTitle(e.target.value)} />
          <div className={ss.label}>Content</div>
          <textarea placeholder="Write something..." {...input} />
          <div className={ss.label}>Send via</div>
          <RadioGroup className={ss.radioGroup} value={radioGroup} onChange={handleSelectVia} />
          <div className={ss.submitBtn} onClick={handleSubmit}>
            Send
          </div>
        </div>
      </Modal>
    </div>
  );
};
