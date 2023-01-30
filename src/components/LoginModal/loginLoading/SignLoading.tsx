import React from 'react';

import ss from './index.module.scss';
import cx from 'classnames';
import { Loading } from '../../Loading';
import { useLoginContext } from '../../../context';

export const SignLoading: React.FC = () => {
  const { styles } = useLoginContext();
  return (
    <div className={cx(ss.signContainer)} style={styles?.signLoadingContainer}>
      <div className={ss.iconBox}>
        <Loading />
      </div>
      <div className={ss.title}>Waiting for signature</div>
      <div className={ss.textContent}>Confirm the signature in your wallet</div>
    </div>
  );
};
