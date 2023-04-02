import React from 'react';

import ss from './index.module.scss';
import cx from 'classnames';
import { useBindDidContext } from '../../../context';
import { Button } from '../../Button';
import { ConnectSuccessIcon } from '../../../icons';

export const BindSuccess: React.FC = () => {
  const { styles } = useBindDidContext();
  return (
    <div className={cx(ss.connectErrorContainer)} style={styles?.connectErrorContainer}>
      <div className={ss.successIconBox}>
        <ConnectSuccessIcon />
      </div>
      <div className={ss.title}>Bind successfully</div>
      <div className={ss.textContent}>The wallet has been successfully bound to Web3MQ Bot</div>
      <div className={ss.buttonBox}>
        <Button type={'primary'}>OK</Button>
      </div>
    </div>
  );
};
