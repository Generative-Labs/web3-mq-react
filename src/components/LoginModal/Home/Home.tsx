import React, { ReactNode, useEffect } from 'react';
import { DesktopIcon, MobileIcon, Web3MqIcon } from '../../../icons';
import { Button } from '../../Button';
import ss from './index.module.scss';
import cx from 'classnames';
// import { useWallet } from '@suiet/wallet-kit';

type IProps = {
  styles: Record<string, any> | null;
  WalletConnectBtnNode: ReactNode;
  handleWeb3MQClick: () => void;
  RenderWallets: ReactNode;
  SuiConnectBtn?: ReactNode;
  handleSuiConnect?: (type: any) => Promise<void>;
};
export const Home: React.FC<IProps> = (props) => {
  const {
    WalletConnectBtnNode,
    handleWeb3MQClick,
    styles,
    RenderWallets,
    SuiConnectBtn = null,
    // handleSuiConnect,
  } = props;
  // const wallet = useWallet();

  // useEffect(() => {
  //   if (!wallet.connected) return;
  //   if (wallet.account?.address) {
  //     if (handleSuiConnect) {
  //       handleSuiConnect(wallet).then();
  //     }
  //   }
  // }, [wallet.connected]);

  return (
    <div className={cx(ss.container)} style={styles?.homeContainer}>
      <div className={ss.chooseWalletBox}>
        <div className={ss.contentBox} style={styles?.contentBox}>
          <div className={ss.top}>
            <div className={ss.icon}>
              <DesktopIcon />
            </div>
            <div>Desktop</div>
          </div>
          {RenderWallets}
          {/*<RenderWallets showCount={3} />*/}
        </div>
        <div className={ss.contentBox} style={styles?.contentBox}>
          <div className={ss.top}>
            <div className={ss.icon}>
              <MobileIcon />
            </div>
            <div className={ss.title}>Mobile</div>
          </div>
          <div className={ss.btnsBox}>
            <Button className={ss.btn} style={styles?.homeButton} onClick={handleWeb3MQClick}>
              <div className={ss.icon}>
                <Web3MqIcon />
              </div>
              Web3MQ
            </Button>
            {WalletConnectBtnNode}
            {SuiConnectBtn}
          </div>
        </div>
      </div>
    </div>
  );
};
