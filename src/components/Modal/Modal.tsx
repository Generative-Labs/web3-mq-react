import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import cx from 'classnames';

import { AppTypeEnum } from '../../context/ChatContext';
import { CloseBtnIcon } from '../../icons';

import ss from './index.scss';

interface IProps {
  visible: boolean;
  appType?: AppTypeEnum;
  closeModal: () => void;
  containerId?: string;
  modalHeader?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  dialogClassName?: string;
  title?: string;
  rightBtn?: React.ReactNode;
}

export const Modal = React.memo((props: PropsWithChildren<IProps>) => {
  const {
    visible,
    appType = AppTypeEnum['pc'],
    closeModal,
    containerId = '',
    modalHeader,
    rightBtn = null,
    children,
    style = {},
    className = '',
    title = '',
    dialogClassName = '',
  } = props;
  const [active, setActive] = useState<boolean>(false);
  const [aniClassName, setAniClassName] = useState<string>('');
  const [contentClassName, setContentClassName] = useState<string>('');
  const bodyOverflow = useRef(window.getComputedStyle(document.body).overflow);

  const onTransitionEnd = () => {
    setAniClassName(visible ? 'enterDone' : 'exitDone');
    setContentClassName(visible ? 'contentEnterDone' : 'contentExitDone');
    if (!visible) {
      setActive(false);
    }
  };

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
      setActive(true);
      setAniClassName('enter');
      setContentClassName('contentEnter');
      setTimeout(() => {
        setAniClassName('enterActive');
        setContentClassName('contentEnterActive');
      });
    } else {
      document.body.style.overflow = bodyOverflow.current;
      setAniClassName('exit');
      setContentClassName('contentExit');
      setTimeout(() => {
        setAniClassName('exitActive');
        setContentClassName('contentExitActive');
      });
    }
    return () => {
      document.body.style.overflow = bodyOverflow.current;
    };
  }, [visible]);

  const handleClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  if (!visible && !active) {
    return null;
  }
  return createPortal(
    <div
      style={style}
      className={cx(ss.modal, ss[aniClassName], className)}
      onTransitionEnd={onTransitionEnd}
      onClick={handleClick}
    >
      <div
        className={cx(ss.dialog, dialogClassName, ss[contentClassName], {
          [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
        })}
      >
        {modalHeader || (
          <div className={ss.titleContainer}>
            <CloseBtnIcon onClick={closeModal} className={ss.closeBtn} />
            <div className={ss.title}>{title}</div>
            <div className={ss.rightBtn}>{rightBtn}</div>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.getElementById(containerId) || document.body
  );
});
