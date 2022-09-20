import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { dateFormat } from '../../utils';
import { useChatContext } from '../../context/ChatContext';
import { usePaginatedNotifications } from './hooks/usePaginatedNotifications';
import useToggle from '../../hooks/useToggle';
import { NotifyIcon, CloseBtnIcon } from '../../icons';
import { Avatar } from '../Avatar';
import { Modal } from '../Modal';


import ss from './index.scss';

export const NotificationList = () => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const { client, appType } = useChatContext();
  const { visible, show, hide } = useToggle();
  const {
    notifications,
    unReadCount,
    handleEvent,
    readNotification,
  } = usePaginatedNotifications(client);
  
  useEffect(() => {
    client.on('notification.getMySubscribeList', handleEvent);
    client.on('notification.messageNew', handleEvent);
    client.on('notification.getList', handleEvent);
    // client.on('contact.getList', handleEvent);
    return () => {
      client.off('notification.getMySubscribeList', handleEvent);
      client.off('notification.messageNew');
      client.off('notification.getList');
      // client.off('contact.getList', handleEvent);
    };
  }, []);

  useEffect(() => {
    const init = async() => {
      let sub = await client.topic.getMySubscribeTopicList({page: 1, size: 20});
    };
    init();
  }, []);

  const activeSender = useMemo(() => {
    const { contactList } = client.contact;
    const chcheObj: any = {};
    // notifyArr.forEach((id) => {
    //   // const senderInfo = contactList?.filter((contact: { user_id: string; }) => contact.user_id === id)[0];
    //   // senderInfo &&
    //   //   (chcheObj[id] = {
    //   //     avatar: senderInfo['avatar'],
    //   //     user_id: senderInfo['user_id'],
    //   //     user_name: senderInfo['user_name'],
    //   //   });
    // });
    return chcheObj;
  }, []);
  
  const ModalHead = useCallback(
    () => (
      <div className={ss.modalHead}>
        <div className={ss.title}>Notification</div>
        <CloseBtnIcon onClick={hide} className={ss.closeBtn} />
      </div>
    ),
    [],
  );

  // 渲染列表列
  const NotificationPreview = useMemo(
    () => {
      if (!notifications) return;
      return notifications.map((notification, index) => {
        return (
          <li 
            key={index}
            className={ss.notificationSimpleContainer}
          >
            <Avatar />
            <div className={ss.notification}>
              <div className={ss.dataInner}>
                <div>{notification.title}</div>
                <div>{dateFormat(notification.timestamp, 'Y/M/D H:I:S')}</div>
              </div>
              <div className={ss.textContainer}>
                {notification.content}
              </div>
            </div>
          </li>
        );
      }); 
    },
    [JSON.stringify(notifications)]
  );

  const handleModalShow = () => {
    show();
    // readNotification();
  };

  return (
    <div className={ss.receiveNotificationContainer}>
      <NotifyIcon className={ss.iconBtn} onClick={handleModalShow} />
      { unReadCount && <div className={ss.iconCount}>{unReadCount <= 99 ? unReadCount : '99+'}</div> } 
      <Modal appType={appType} visible={visible} closeModal={hide} modalHeader={<ModalHead />} >
        <div className={ss.modalBody} ref={listRef}>
          <ul className={ss.chatUl}>
            {NotificationPreview}
          </ul>
        </div>
      </Modal>
    </div>
  );
};
