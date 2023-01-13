import React from 'react';

import { StepStringEnum, useLoginContext } from '../../../context';
import { ArgentWalletIcon, ViewAllIcon, WalletMetaMaskIcon } from '../../../icons';
import { Loading } from '../../Loading';

import cx from 'classnames';
import ss from './index.module.scss';

type IProps = {
  showCount?: number;
};

export const RenderWallets: React.FC<IProps> = (props) => {
  const { showCount = 0 } = props;
  const { styles, showLoading, setWalletType, getEthAccount, setStep } = useLoginContext();
  const walletsConfig = [
    {
      type: 'eth',
      title: 'MetaMask',
      icon: <WalletMetaMaskIcon />,
      handleClick: async () => {
        setWalletType('eth');
        await getEthAccount('eth');
      },
    },
    {
      type: 'starknet',
      title: 'Argent X',
      icon: <ArgentWalletIcon />,
      handleClick: async () => {
        await getEthAccount('starknet');
        setWalletType('starknet');
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
    <div
      className={cx(ss.wallets, {
        [ss.walletsShort]: walletsConfig.length <= showCount,
      })}
    >
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
      {walletsConfig.length > 4 && showCount !== 0 && (
        <div
          className={ss.walletItem}
          onClick={() => {
            console.log('show all wallet');
            setStep(StepStringEnum.VIEW_ALL);
          }}
          style={styles?.walletItem}
        >
          <div className={ss.walletIcon}>
            <ViewAllIcon />
          </div>
          <div className={ss.walletName}>View All</div>
        </div>
      )}
    </div>
  );
};
