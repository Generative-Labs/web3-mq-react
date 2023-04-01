import React from 'react';

import ss from './index.module.scss';
import cx from 'classnames';
import { BindStepStringEnum, useBindDidContext } from '../../../context';
import { ConnectErrorIcon } from '../../../icons';
import { Button } from '../../Button';

export const SignError: React.FC = () => {
  const { styles, setStep, userAccount } = useBindDidContext();
  return (
    <div className={cx(ss.signErrorContainer)} style={styles?.signErrorContainer}>
      <div className={ss.iconBox}>
        <ConnectErrorIcon />
      </div>
      <div className={ss.title}>signature error</div>
      <div className={ss.textContent}>
        The signature attempt failed. Click try again and follow the steps to connect to your
        wallet.
      </div>
      <div className={ss.buttonBox}>
        <Button
          type={'primary'}
          onClick={() => {
            if (userAccount?.userExist) {
              setStep(BindStepStringEnum.READY_BIND);
            } else {
              setStep(BindStepStringEnum.READY_SIGN_UP);
            }
          }}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};
