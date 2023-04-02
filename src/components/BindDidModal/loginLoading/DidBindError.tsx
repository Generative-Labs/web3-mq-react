import React from 'react';

import ss from './index.module.scss';
import cx from 'classnames';
import { BindStepStringEnum, useBindDidContext } from '../../../context';
import { Button } from '../../Button';
import { ConnectErrorIcon } from '../../../icons';

export const DidBindError: React.FC = () => {
  const { styles, setStep } = useBindDidContext();
  return (
    <div className={cx(ss.connectErrorContainer)} style={styles?.connectErrorContainer}>
      <div className={ss.iconBox}>
        <ConnectErrorIcon />
      </div>
      <div className={ss.title}>Bind failure</div>
      <div className={ss.textContent}>Wallet bind failed, please click back to re-sign</div>
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
