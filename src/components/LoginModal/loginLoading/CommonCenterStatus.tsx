import React from 'react';

import ss from './index.module.scss';
import cx from 'classnames';
import { Button } from '../../Button';

export type CommonCenterStatusIProp = {
  styles: Record<string, any> | null;
  title: string;
  textContent: string;
  icon: React.ReactNode;
  customBtn?: React.ReactNode;
  btnText?: string;
  handleBtnClick?: () => void;
  showBtn?: boolean;
  addressBox?: React.ReactNode;
  authToDappList?: React.ReactNode;
};

export const CommonCenterStatus: React.FC<CommonCenterStatusIProp> = (props) => {
  const {
    styles,
    handleBtnClick = () => {},
    title,
    textContent,
    btnText,
    icon,
    showBtn = false,
    customBtn = (
      <Button type={'primary'} onClick={handleBtnClick}>
        {btnText}
      </Button>
    ),
    addressBox,
    authToDappList,
  } = props;
  return (
    <div className={cx(ss.signErrorContainer)} style={styles?.signErrorContainer}>
      <div className={ss.iconBox}>{icon}</div>
      {addressBox}
      {title && <div className={ss.title}>{title}</div>}
      <div className={ss.textContent}>{textContent}</div>
      {authToDappList}
      {showBtn && <div className={ss.buttonBox}>{customBtn}</div>}
    </div>
  );
};
