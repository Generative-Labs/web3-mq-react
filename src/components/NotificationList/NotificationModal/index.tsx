import React from 'react';

import { NotificationList } from '../NotificationList';
import { Modal } from '../../Modal';
import { AppTypeEnum } from '../../../context';
import useToggle from '../../../hooks/useToggle';
import { NotificationIcon } from '../../../icons';


import ss from './index.scss';

type NotificationModalProps = {
  appType?: AppTypeEnum
  btnNode?: React.ReactNode;
  isShow?: boolean;
  title?: string;
}
export const NotificationModal: React.FC<NotificationModalProps> = (props) => {
  const { 
    appType = AppTypeEnum.pc,
    btnNode = null, 
    isShow = false, 
    title = 'Notification' 
  } = props;
  const { visible, show, hide } = useToggle(isShow);

  const handleShow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (visible) {
      hide();
    } else {
      show();
    }
  };

  return (
    <div onClick={handleShow}>
      {btnNode || (
        <div className={ss.btnContainer}>
          <NotificationIcon />
          <div className={ss.title}>Notification</div>
        </div>
      )}
      <Modal
        appType={appType}
        visible={visible}
        closeModal={hide}
        title={title}
      >
        <div className={ss.modalBody}>
          <NotificationList />
        </div>
      </Modal>
    </div>
  );
};