import React, { useEffect } from 'react';
import { DesktopIcon } from '../../../../icons/DesktopIcon';
import { MobileIcon } from '../../../../icons/MobileIcon';

import ss from './index.module.scss';
import { StepStringEnum } from '../../index';
import { MqButton } from '../../../MqButton';
import { Button } from '../../../Button';
import { useLoginContext } from '../../../../context';

import web3mqIcon from '../../../../assets/web3mqIcon.svg';
import walletConnectIcon from '../../../../assets/walletConnectIcon.svg';
import { MetaMaskIcon, WalletConnectIcon, WalletMetaMaskIcon, Web3MqIcon } from '../../../../icons';

// const web3mqIcon = require('../../../../assets/web3mqIcon.svg').default;
// const walletConnectIcon = require('../../../../assets/walletConnectIcon.svg').default;
//
export const StepOne: React.FC = () => {
  const { setStep, setHeaderTitle, step, getEthAccount } = useLoginContext();

  useEffect(() => {
    setHeaderTitle('Connect Dapp');
  }, []);

  return (
    <div className={ss.container}>
      {step === StepStringEnum.HOME && (
        <div className={ss.stepOneBox}>
          <div className={ss.contentBox}>
            <div className={ss.top}>
              <div className={ss.icon}>
                <DesktopIcon />
              </div>
              <div>Desktop</div>
            </div>
            <div className={ss.walletBox}>
              <div className={ss.walletItem} onClick={getEthAccount}>
                <div className={ss.walletIcon}>
                  <WalletMetaMaskIcon />
                </div>
                <div className={ss.walletName}>MetaMask</div>
              </div>
              {/*<div*/}
              {/*    className={ss.walletItem}*/}
              {/*    onClick={() => {*/}
              {/*      setHeaderTitle('Choose Desktop wallets');*/}
              {/*      setStep(StepStringEnum.VIEW_ALL);*/}
              {/*    }}*/}
              {/*>*/}
              {/*  <div className={ss.walletIcon}>*/}
              {/*    <ViewAllIcon />*/}
              {/*  </div>*/}
              {/*  <div className={ss.walletName}>View All</div>*/}
              {/*</div>*/}
            </div>
          </div>
          <div className={ss.contentBox}>
            <div className={ss.top}>
              <div className={ss.icon}>
                <MobileIcon />
              </div>
              <div className={ss.title}>Mobile</div>
            </div>
            <div className={ss.btnsBox}>
              <MqButton className={ss.btn}>
                <div className={ss.icon}>
                  <Web3MqIcon />
                </div>
                Web3MQ
              </MqButton>
              <MqButton className={ss.btn}>
                <div className={ss.icon}>
                  <WalletConnectIcon />
                </div>
                WalletConnect
              </MqButton>
            </div>
          </div>
        </div>
      )}
      {step === StepStringEnum.VIEW_ALL && (
        <div>
          Step two
          <Button
            onClick={() => {
              setStep(StepStringEnum.LOGIN_MODAL);
            }}
          >
            next
          </Button>
        </div>
      )}
    </div>
  );
};
