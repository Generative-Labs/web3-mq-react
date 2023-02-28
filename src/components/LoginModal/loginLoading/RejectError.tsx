import React from 'react';

import ss from './index.module.scss';
import cx from 'classnames';
import { StepStringEnum, useLoginContext } from '../../../context';
import { ConnectErrorIcon } from '../../../icons';
import { Button } from '../../Button';

export const RejectError: React.FC = () => {
  const { styles, setStep } = useLoginContext();
  return (
    <div className={cx(ss.connectErrorContainer)} style={styles?.connectErrorContainer}>
      <div className={ss.iconBox}>
        <ConnectErrorIcon />
      </div>
      <div className={ss.title}>Error Reject</div>
      <div className={ss.textContent}>
        User rejected methods.
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
