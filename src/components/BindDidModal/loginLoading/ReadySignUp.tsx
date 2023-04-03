import React from 'react';

import ss from './index.module.scss';
import cx from 'classnames';
import { BindStepStringEnum, useBindDidContext } from '../../../context';
import { Button, LoginModal } from '../../../components';
import { BindDidWarningIcon } from '../../../icons';

export const ReadySignUp: React.FC = () => {
  const { styles, setStep, userAccount, appType, containerId, client, env, setUserAccount, walletConnectClient, wcSession } =
    useBindDidContext();

  const handleLoginEvent = (eventData: any) => {
    if (eventData.data) {
      if (eventData.type === 'login') {
        const { userid, address } = eventData.data;
        setUserAccount({
          userid,
          address,
          walletType: 'eth',
          userExist: true,
        });
        setStep(BindStepStringEnum.READY_BIND);
      }
      if (eventData.type === 'register') {
        const { privateKey, publicKey, address } = eventData.data;
        setUserAccount({
          userid: userAccount?.userid || '',
          address,
          walletType: 'eth',
          userExist: true,
        });
      }
    }
  };

  return (
    <div className={cx(ss.connectErrorContainer)} style={styles?.connectErrorContainer}>
      <div className={ss.iconBox}>
        <BindDidWarningIcon />
      </div>
      <div className={ss.title}>Wallet address not registered</div>
      <div className={ss.textContent}>
        Your wallet address is not registered to the web3mq network
      </div>
      <div className={ss.buttonBox}>
        <LoginModal
          client={client}
          env={env}
          handleLoginEvent={handleLoginEvent}
          containerId={containerId}
          appType={appType}
          propWalletConnectClient={walletConnectClient.current}
          propWcSession={wcSession}
          loginBtnNode={<Button type={'primary'}>SignUp</Button>}
          account={userAccount}
        />
      </div>
    </div>
  );
};
