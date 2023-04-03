import React from 'react';
import { Button } from '../Button';
import { useLoginContext, StepStringEnum, useWalletConnectContext } from '../../context';
import { WalletConnectIcon } from '../../icons';

import ss from './index.module.scss';

export const WalletConnectButton: React.FC = () => {
  const { 
    setWalletInfo, 
    setWalletType, 
    getAccount,
    setStep,
  } = useLoginContext();
  const { create, connect, closeModal, onSessionConnected } = useWalletConnectContext();
  
  const handleWalletConnectClick = async () => {
    setStep(StepStringEnum.CONNECT_LOADING);
    await create();
    try {
      const session = await connect();
      console.log('Established session:', session);
      setWalletType('eth');
      setWalletInfo({
        name: 'WalletConnect',
        type: 'walletConnect'
      });
      // select first account
      const account = Object.values(session.namespaces)
        .map((namespace) => namespace.accounts)
        .flat()[0];
      const [namespace, reference, address] = account.split(':');
      await getAccount('eth', address.toLowerCase());
      onSessionConnected(session);
    } catch (error) {
      console.error(error);
      setStep(StepStringEnum.REJECT_CONNECT);
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