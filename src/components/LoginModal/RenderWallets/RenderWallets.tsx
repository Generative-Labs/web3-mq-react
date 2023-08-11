import React, { ReactNode } from 'react';

import { ArgentWalletIcon, BraavosIcon, ViewAllIcon, WalletMetaMaskIcon } from '../../../icons';
import { Loading } from '../../Loading';
import ss from './index.module.scss';
import type { WalletNameType, WalletType } from '@web3mq/client';

type IProps = {
  showCount?: number;
  styles: Record<string, any> | null;
  showLoading: boolean;
  handleWalletClick: (walletType: WalletType) => Promise<void>;
  handleViewAll: () => void;
};

type WalletConfigType = {
  type: WalletType;
  title: WalletNameType;
  icon: ReactNode;
  handleClick: any;
};

export const RenderWallets: React.FC<IProps> = (props) => {
  const { showCount = 0, styles, showLoading, handleWalletClick, handleViewAll } = props;
  const walletsConfig: WalletConfigType[] = [
    {
      type: 'metamask',
      title: 'MetaMask',
      icon: <WalletMetaMaskIcon />,
      handleClick: async () => {
        await handleWalletClick('metamask');
      },
    },
    {
      type: 'argentX',
      title: 'Argent X',
      icon: <ArgentWalletIcon />,
      handleClick: async () => {
        await handleWalletClick('argentX');
      },
    },
    {
      type: 'braavos',
      title: 'Braavos',
      icon: <BraavosIcon />,
      handleClick: async () => {
        await handleWalletClick('braavos');
      },
    },
  ];

  const WalletItem = (props: { icon: React.ReactNode; title: string; handleClick: () => void }) => {
    const { icon, handleClick, title } = props;
    return (
      <div className={ss.walletItem} onClick={handleClick} style={styles?.walletItem}>
        <div className={ss.walletIcon}>{icon}</div>
        <div className={ss.walletName}>{title}</div>
      </div>
    );
  };

  return (
    <div className={ss.wallets}>
      {walletsConfig.map((item, index) => {
        if (walletsConfig.length > showCount + 1 && showCount && index >= showCount) {
          return null;
        }
        if (showLoading) {
          return (
            <div
              key={index}
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
          );
        } else {
          return <WalletItem {...item} key={index} />;
        }
      })}
      {walletsConfig.length > showCount + 1 && showCount !== 0 && (
        <div className={ss.walletItem} onClick={handleViewAll} style={styles?.walletItem}>
          <div className={ss.walletIcon}>
            <ViewAllIcon />
          </div>
          <div className={ss.walletName}>View All</div>
        </div>
      )}
    </div>
  );
};
