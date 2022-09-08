import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { dateTransform } from '../../utils';
import { useChatContext } from '../../context/ChatContext';
import { usePaginatedNotifications } from './hooks/usePaginatedNotifications';
import useToggle from '../../hooks/useToggle';
import { NotifyIcon, CloseBtnIcon } from '../../icons';
import { Avatar } from '../Avatar';
import { Modal } from '../Modal';
import { Paginator } from '../Paginator';
import { Loading } from '../Loading';

import ss from './index.scss';

export const NotificationList = () => {
  const listRef = useRef<HTMLDivElement | null>(null);
  const { client, appType } = useChatContext();
  const { visible, show, hide } = useToggle();
  const {
    status,
    refreshing,
    notifications,
    unReadCount,
    notifyArr,
    isContactUpdate,
    loadNextPage,
    handleEvent,
    readNotification,
  } = usePaginatedNotifications(client);
  
  useEffect(() => {
    client.on('notification.messageNew', handleEvent);
    client.on('notification.getList', handleEvent);
    client.on('contact.getList', handleEvent);
    return () => {
      client.off('notification.messageNew');
      client.off('notification.getList');
      client.off('contact.getList', handleEvent);
    };
  }, []);

  const activeSender = useMemo(() => {
    const { contactList } = client.contact;
    const chcheObj: any = {};
    notifyArr.forEach((id) => {
      // const senderInfo = contactList?.filter((contact: { user_id: string; }) => contact.user_id === id)[0];
      // senderInfo &&
      //   (chcheObj[id] = {
      //     avatar: senderInfo['avatar'],
      //     user_id: senderInfo['user_id'],
      //     user_name: senderInfo['user_name'],
      //   });
    });
    return chcheObj;
  }, [JSON.stringify(notifyArr), isContactUpdate]);
  
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
      return notifications.map(notification => {
        return (
          <li 
            key={notification.id}
            className={ss.notificationSimpleContainer}
          >
            <Avatar image={activeSender[notification.sender_id] && activeSender[notification.sender_id].avatar || ''} />
            <div className={ss.notification}>
              <div className={ss.dataInner}>
                <div>{activeSender[notification.sender_id] && activeSender[notification.sender_id].user_name || ''}</div>
                <div>{dateTransform(notification.created_at)}</div>
              </div>
              <div className={ss.textContainer}>
                {notification.notification_payload}
              </div>
            </div>
          </li>
        );
      }); 
    },
    [JSON.stringify(notifications), JSON.stringify(activeSender)]
  );

  const handleModalShow = () => {
    show();
    readNotification();
  };

  return (
    <div className={ss.receiveNotificationContainer}>
      <NotifyIcon className={ss.iconBtn} onClick={handleModalShow} />
      { unReadCount && <div className={ss.iconCount}>{unReadCount <= 99 ? unReadCount : '99+'}</div> } 
      <Modal visible={visible} closeModal={hide} modalHeader={<ModalHead />} >
        <div className={ss.modalBody} ref={listRef}>
          { status.loading ? (
            <div className={ss.loadingContainer}>
              <Loading />
            </div>
          ) : (
            <Paginator element={listRef} showLoading={refreshing} loadNextPage={loadNextPage}>
              <ul className={ss.chatUl}>
                {NotificationPreview}
              </ul>
            </Paginator>
          )}
        </div>
      </Modal>
    </div>
  );
};
