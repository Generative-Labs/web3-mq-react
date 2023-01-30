import React from 'react';

import ss from './index.module.scss';
import cx from 'classnames';
import { StepStringEnum, useLoginContext } from '../../../context';
import { Button } from '../../Button';
import { ConnectErrorIcon } from '../../../icons';

export const ConnectError: React.FC = () => {
  const { styles, setStep } = useLoginContext();
  return (
    <div className={cx(ss.connectErrorContainer)} style={styles?.connectErrorContainer}>
      <div className={ss.iconBox}>
        <ConnectErrorIcon />
      </div>
      <div className={ss.title}>Error connecting</div>
      <div className={ss.textContent}>
        The connection attempt failed. Please click try again and follow the steps to connect in
        your wallet.
      </div>
      <div className={ss.buttonBox}>
        <Button
          type={'primary'}
          onClick={() => {
            setStep(StepStringEnum.HOME);
          }}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};
