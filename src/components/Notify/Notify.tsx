import React, { useCallback, useEffect, useState } from 'react';

import useToggle from '../../hooks/useToggle';
import { useInput } from '../../hooks/useInput';
import { useChatContext } from '../../context/ChatContext';
import { BulkMessageIcon, CloseBtnIcon } from '../../icons';
import { Modal } from '../Modal';
import { SelectUser } from './SelectUser';
import { RadioGroup, IValueType } from '../RadioGroup';

import ss from './index.scss';

enum RadioEnum {
  all = '1',
  chat = '2',
  notification = '3',
}

const radioGroup: IValueType[] = [
  { id: RadioEnum.all, name: 'All' },
  { id: RadioEnum.chat, name: 'Chat' },
  { id: RadioEnum.notification, name: 'Notification' },
];

export const Notify = () => {
  const { client } = useChatContext('Notify');
  const [users, setSsers] = useState<string[]>([]);
  const [via, setVia] = useState<string>(RadioEnum.all);
  const { visible, show, hide } = useToggle();
  const { input, setValue } = useInput('');
  const { value } = input;

  useEffect(() => {
    if (!visible) {
      setSsers([]);
      setVia('1');
      setValue('');
    }
  }, [visible]);

  const handleSelectUser = useCallback((item: any[]) => {
    const ids = item.map((users) => users.user_id);
    setSsers(ids);
  }, []);

  const handleSelectVia = useCallback((item: IValueType) => {
    setVia(item.id);
  }, []);

  const handleSubmitChat = async () => {
    for (let i = 0; i < users.length; i++) {
      let user_id = users[i];
      // let { roomId, existRoomInfo } = await client.channel.getRoomByBulk({
      //   user_id: user_id,
      // });
      // if (roomId) {
      //   client.messages.sendMessageByBulk(value, roomId);
      // }
    }
  };

  const handleSubmit = useCallback(async () => {
    if (users.length === 0 || !value) {
      return;
    }
    if (via === RadioEnum.notification) {
      // await client.notify.sendNotify({ ids: users, text: value });
    }
    if (via === RadioEnum.chat) {
      await handleSubmitChat();
    }
    if (via === RadioEnum.all) {
      handleSubmitChat();
      // await client.notify.sendNotify({ ids: users, text: value });
    }
    hide();
  }, [via, users, value]);

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
      <Modal visible={visible} closeModal={hide} modalHeader={<ModalHead />}>
        <div className={ss.modalBody}>
          <div className={ss.title}>
            Sending a message to multiple contacts or group chats at the same time
          </div>
          <div className={ss.label}>Send to</div>
          <SelectUser onChange={handleSelectUser} />
          <div className={ss.label}>Message</div>
          <textarea placeholder="Write something..." {...input} />
          <div className={ss.label}>Send via</div>
          <RadioGroup className={ss.radioGroup} value={radioGroup} onChange={handleSelectVia} />
        </div>
        <div className={ss.submitBtn} onClick={handleSubmit}>
          Send
        </div>
      </Modal>
    </div>
  );
};
