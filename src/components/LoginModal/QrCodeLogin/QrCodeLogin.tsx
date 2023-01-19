import React from 'react';
import cx from 'classnames';
import ss from './index.module.scss';
import { useLoginContext } from '../../../context';
import { Loading } from '../../Loading';

export const QrCodeLogin: React.FC = () => {
  const { qrCodeUrl } = useLoginContext();
  return (
    <div className={cx(ss.qrCodeBox)}>
      <div className={ss.title}>Scan with your Web3MQ</div>
      <div className={ss.imgBox}>{!qrCodeUrl ? <Loading /> : <img src={qrCodeUrl} alt="" />}</div>
    </div>
  );
};
