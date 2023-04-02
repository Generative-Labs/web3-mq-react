import React from 'react';

import { BindStepStringEnum, useBindDidContext } from '../../../context';
import {ArgentXIcon, ConnectSuccessIcon, MetaMaskIcon, WalletConnectIcon, Web3MqWalletIcon} from '../../../icons';

import ss from './index.module.scss';
import cx from 'classnames';
import { getShortAddress } from '../../../utils';
import { Button } from '../../Button';

type IProps = {
  showCount?: number;
};

export const ReadyBind: React.FC<IProps> = (props) => {
  const { showCount = 0 } = props;
  const {
    styles,
    showLoading,
    setStep,
    walletInfo,
    userAccount,
    setShowLoading,
    handleBindDidEvent,
    sendSign,
  } = useBindDidContext();

  if (!userAccount) {
    setStep(BindStepStringEnum.HOME);
    return null;
  }

  const handleSubmit = async () => {
    setShowLoading(true);
    setStep(BindStepStringEnum.SIGN_LOADING);
    try {
      await sendSign();
      setShowLoading(false);
    } catch (e: any) {
      handleBindDidEvent({
        msg: e.message,
        data: null,
        type: 'error',
      });
      setShowLoading(false);
      setStep(BindStepStringEnum.SIGN_ERROR);
    }
  };

  return (
    <div className={ss.readyBind}>
      <div className={ss.successIconBox}>
        <ConnectSuccessIcon />
      </div>
      <div className={cx(ss.addressBox)} style={styles?.addressBox}>
        {walletInfo?.type ? (
          walletInfo.type === 'web3mq' ? (
            <Web3MqWalletIcon />
          ) : walletInfo.type === 'starknet' ? (
            <ArgentXIcon />
          ) : walletInfo.type === 'eth' ? (
            <MetaMaskIcon />
          ) : (
            <WalletConnectIcon style={{ height: '21px' }} />
          )
        ) : (
          <MetaMaskIcon />
        )}
        <div className={ss.centerText}>{walletInfo?.name || 'MetaMask'}</div>
        <div className={ss.addressText}>{getShortAddress(userAccount.address)}</div>
      </div>
      <div className={ss.contentText}>Wallet connection successful</div>
      <div className={ss.btnBox}>
        <Button
          style={styles?.loginButton}
          className={ss.button}
          disabled={showLoading}
          type="primary"
          onClick={handleSubmit}
        >
          Bind wallet
        </Button>
      </div>
    </div>
  );
};
