import React, { useEffect, useMemo, useState } from 'react';

import ss from './index.scss';
import type { GroupSettingsModalTypeEnum } from '../GroupSettings';
import {  SuccessIcon } from '../../../icons';
import cx from 'classnames';
type IProps = {
  className?: string;
  style?: React.CSSProperties;
  handleModalTypeChange: (type?: GroupSettingsModalTypeEnum) => void;
};

export const UpdateSuccess: React.FC<IProps> = (props) => {
  const { handleModalTypeChange } = props;

  useEffect(() => {
    setTimeout(() => {
      handleModalTypeChange(undefined);
    }, 1000);
  }, []);

  return (
    <div className={ss.updateSuccessBox}>
      <div className={cx(ss.iconBox)}>
        <SuccessIcon />
      </div>
      <div className={ss.description}>Update successful</div>
    </div>
  );
};
