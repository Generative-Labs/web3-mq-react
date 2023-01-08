import React, { useEffect } from 'react';

import {
  WalletConnectIcon,
  WalletMetaMaskIcon,
  Web3MqIcon,
  DesktopIcon,
  MobileIcon,
} from '../../../icons';
import { Button } from '../../Button';
import { StepStringEnum, useLoginContext } from '../../../context';

import ss from './index.module.scss';
import cx from 'classnames';
import { Loading } from '../../Loading';

export const Home: React.FC = () => {
  const { setStep, setHeaderTitle, step, getEthAccount, styles, showLoading } = useLoginContext();

  useEffect(() => {
    setHeaderTitle('Connect Dapp');
  }, []);

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
            <div className={ss.walletBox}>
              {showLoading ? (
                <div
                  className={ss.walletItem}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...styles?.walletItem,
                  }}
                >
                  <Loading />
                </div>
              ) : (
                <div className={ss.walletItem} onClick={getEthAccount} style={styles?.walletItem}>
                  <div className={ss.walletIcon}>
                    <WalletMetaMaskIcon />
                  </div>
                  <div className={ss.walletName}>MetaMask</div>
                </div>
              )}
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
          <div className={ss.contentBox} style={styles?.contentBox}>
            <div className={ss.top}>
              <div className={ss.icon}>
                <MobileIcon />
              </div>
              <div className={ss.title}>Mobile</div>
            </div>
            <div className={ss.btnsBox}>
              <Button className={ss.btn} style={styles?.homeButton}>
                <div className={ss.icon}>
                  <Web3MqIcon />
                </div>
                Web3MQ
              </Button>
              <Button className={ss.btn} style={styles?.homeButton}>
                <div className={ss.icon}>
                  <WalletConnectIcon />
                </div>
                WalletConnect
              </Button>
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
