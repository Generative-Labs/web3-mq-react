import React from 'react';

import { DesktopIcon, MobileIcon, Web3MqIcon } from '../../../icons';
import { Button } from '../../Button';
import { RenderWallets } from '../RenderWallets';
import { StepStringEnum, useLoginContext } from '../../../context';

import ss from './index.module.scss';
import cx from 'classnames';

export const Home: React.FC = () => {
  const { step, styles, handleWeb3mqCallback, setStep, client } = useLoginContext();

  const handleWeb3mqClick = () => {
    setStep(StepStringEnum.QR_CODE);
    client.initDappConnectClient({ dAppID: 'SwapChat:im' }, handleWeb3mqCallback);
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
