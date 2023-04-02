import React from 'react';

import ss from './index.module.scss';
import cx from 'classnames';
import { Loading } from '../../Loading';
import {useBindDidContext} from '../../../context';

export const DidBindLoading: React.FC = () => {
  const { styles } = useBindDidContext();
  return (
    <div className={cx(ss.connectContainer)} style={styles?.connectLoadingContainer}>
      <div className={ss.iconBox}>
        <Loading />
      </div>
      <div className={ss.title}>Waiting for binding</div>
      <div className={ss.textContent}>Waiting for telegram to bind wallet</div>
    </div>
  );
};
