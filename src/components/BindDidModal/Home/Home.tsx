import React from 'react';
import { DesktopIcon, MobileIcon, Web3MqIcon } from '../../../icons';
import { Button } from '../../Button';
import { RenderWallets } from '../RenderWallets';
import {BindStepStringEnum, useBindDidContext} from '../../../context';
import ss from './index.module.scss';
import cx from 'classnames';
import { DappConnect } from '@web3mq/dapp-connect';

type IProps = {
  WalletConnectBtnNode: React.ReactNode;
};
export const Home: React.FC<IProps> = (props) => {
  const {WalletConnectBtnNode } = props;
  const { step, styles, setStep, env, setDappConnectClient } = useBindDidContext();

  const handleWeb3mqClick = () => {
    new Promise((resolve) => {
      setDappConnectClient(
        new DappConnect({ dAppID: 'SwapChat:im', keepAlive: false, env }, () => {}),
      );
      resolve('success');
    }).then(() => {
      setStep(BindStepStringEnum.QR_CODE);
    });
  };

  return (
    <div className={cx(ss.container)} style={styles?.homeContainer}>
      {step === BindStepStringEnum.HOME && (
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
              { WalletConnectBtnNode }
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
