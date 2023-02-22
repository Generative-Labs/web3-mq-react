import React from 'react';

import { DesktopIcon, MobileIcon, Web3MqIcon } from '../../../icons';
import { Button } from '../../Button';
import { RenderWallets } from '../RenderWallets';
import { StepStringEnum, useLoginContext } from '../../../context';

import ss from './index.module.scss';
import cx from 'classnames';
import { DappConnect } from '@web3mq/dapp-connect';

export const Home: React.FC = () => {
  const { step, styles, setStep, dappConnectClient } = useLoginContext();

  const handleWeb3mqClick = () => {
    new Promise((resolve) => {
      dappConnectClient.current = new DappConnect(
        { dAppID: 'SwapChat:im', keepAlive: false },
        () => {},
      );
      resolve('success');
    }).then(() => {
      setStep(StepStringEnum.QR_CODE);
    });
  };
  return (
    <div className={cx(ss.container)} style={styles?.homeContainer}>
      {step === StepStringEnum.HOME && (
        <div className={ss.chooseWalletBox}>
          <div className={ss.contentBox} style={styles?.contentBox}>
            <div className={ss.top}>
              <div className={ss.icon}>
                <DesktopIcon />
              </div>
              <div>Desktop</div>
            </div>
            <RenderWallets showCount={3} />
          </div>
          <div className={ss.contentBox} style={styles?.contentBox}>
            <div className={ss.top}>
              <div className={ss.icon}>
                <MobileIcon />
              </div>
              <div className={ss.title}>Mobile</div>
            </div>
            <div className={ss.btnsBox}>
              <Button className={ss.btn} style={styles?.homeButton} onClick={handleWeb3mqClick}>
                <div className={ss.icon}>
                  <Web3MqIcon />
                </div>
                Web3MQ
              </Button>
              {/*<Button className={ss.btn} style={styles?.homeButton}>*/}
              {/*  <div className={ss.icon}>*/}
              {/*    <WalletConnectIcon />*/}
              {/*  </div>*/}
              {/*  WalletConnect*/}
              {/*</Button>*/}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
