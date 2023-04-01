import React from 'react';
import { Button } from '../../Button';
import { BindStepStringEnum, useBindDidContext } from '../../../context';
import { WalletConnectIcon } from '../../../icons';

import ss from './index.module.scss';

export const WalletConnectButton: React.FC = () => {
  const {
    setWalletInfo,
    setWalletType,
    getAccount,
    setStep,
    create,
    connect,
    closeModal,
    onSessionConnected,
  } = useBindDidContext();

  const handleWalletConnectClick = async () => {
    setStep(BindStepStringEnum.CONNECT_LOADING);
    await create();
    try {
      const session = await connect();
      console.log('Established session:', session);
      setWalletType('eth');
      setWalletInfo({
        name: 'WalletConnect',
        type: 'walletConnect',
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
      setStep(BindStepStringEnum.REJECT_CONNECT);
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
