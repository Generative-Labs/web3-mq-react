import React from 'react';

import ss from './index.module.scss';
import cx from 'classnames';
import {BindStepStringEnum, useBindDidContext} from '../../../context';
import { ConnectErrorIcon } from '../../../icons';
import { Button } from '../../Button';

export const RejectError: React.FC = () => {
  const { styles, setStep } = useBindDidContext();
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
            setStep(BindStepStringEnum.HOME);
          }}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};
