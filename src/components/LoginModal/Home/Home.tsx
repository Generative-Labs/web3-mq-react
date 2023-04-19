import React, {ReactNode} from 'react';
import { DesktopIcon, MobileIcon, Web3MqIcon } from '../../../icons';
import { Button } from '../../Button';
import ss from './index.module.scss';
import cx from 'classnames';

type IProps = {
  styles: Record<string, any> | null;
  WalletConnectBtnNode: ReactNode;
  handleWeb3MQClick: () => void;
  RenderWallets: ReactNode
};
export const Home: React.FC<IProps> = (props) => {
  const { WalletConnectBtnNode, handleWeb3MQClick, styles, RenderWallets } = props;

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
          { RenderWallets }
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
          </div>
        </div>
      </div>
    </div>
  );
};
