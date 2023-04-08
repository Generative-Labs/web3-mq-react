import React from 'react';
import { Button } from '../Button';
import { WalletConnectIcon } from '../../icons';

import ss from './index.module.scss';
import type { SessionTypes } from '@walletconnect/types';

type ConnectWalletInfoType = {
  address: string;
  walletType: 'walletConnect' | 'web3mq' | 'eth' | 'starknet';
  walletName: 'MetaMask' | 'Argent' | 'DappConnect' | 'WalletConnect';
};
type IProp = {
  handleConnectEvent: (event: ConnectWalletInfoType) => void;
  create: () => Promise<void>;
  connect: () => Promise<SessionTypes.Struct>;
  closeModal: () => void;
  onSessionConnected: (session: SessionTypes.Struct) => void;
  handleError: any;
  handleClientStep: any;
};

export const WalletConnectButton: React.FC<IProp> = (props) => {
  const {
    handleConnectEvent,
    create,
    connect,
    closeModal,
    onSessionConnected,
    handleError,
    handleClientStep,
  } = props;
  const handleWalletConnectClick = async () => {
    handleClientStep();
    await create();
    try {
      const session = await connect();
      console.log('Established session:', session);
      // select first account
      const account = Object.values(session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat()[0];
      const [namespace, reference, address] = account.split(':');
      await handleConnectEvent({
        address: address.toLowerCase(),
        walletName: 'WalletConnect',
        walletType: 'walletConnect',
      });
      onSessionConnected(session);
    } catch (error) {
      console.error(error);
      handleError();
      // ignore rejection
    } finally {
      // close modal in case it was open
      closeModal();
    }
  };

  return (
    <>
      <Button className={ss.btn} onClick={handleWalletConnectClick}>
        <div className={ss.icon}>
          <WalletConnectIcon />
        </div>
        WalletConnect
      </Button>
    </>
  );
};
