import React from 'react';
import type SignClient from '@walletconnect/sign-client';
import { Client } from '@web3mq/client';
import type { SessionTypes } from '@walletconnect/types';
import type { DappConnect as DappConnectType } from '@web3mq/dapp-connect';
import { AppTypeEnum } from '../../context';
import { LoginModal } from '../LoginModal';
import { Button } from '../Button';
import type { UserAccountType } from '../LoginModal/hooks/useLogin';

type IProps = {
  client?: any;
  url: string;
  containerId: string;
  isShow?: boolean;
  appType?: AppTypeEnum;
  customBtnNode?: React.ReactNode;
  styles?: Record<string, any>;
  modalClassName?: string;
  env?: 'dev' | 'test';
  handleEvent: (eventData: any) => void;
  propWalletConnectClient?: SignClient;
  propWcSession?: SessionTypes.Struct;
  propDappConnectClient?: DappConnectType;
  account?: UserAccountType;
};

export const ResetPasswordModal: React.FC<IProps> = (props) => {
  const {
    isShow,
    client = Client as any,
    appType = window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc'],
    containerId,
    customBtnNode = null,
    styles,
    modalClassName = '',
    handleEvent,
    env = 'test',
    propDappConnectClient,
    propWalletConnectClient,
    propWcSession,
    account,
  } = props;

  return (
    <div>
      <LoginModal
        env={env}
        modalClassName={modalClassName}
        styles={styles}
        containerId={containerId}
        client={client}
        isShow={isShow}
        handleLoginEvent={handleEvent}
        appType={appType}
        loginBtnNode={customBtnNode || <Button className="sign_btn">Reset Password</Button>}
        propDappConnectClient={propDappConnectClient}
        propWalletConnectClient={propWalletConnectClient}
        propWcSession={propWcSession}
        account={account}
        isResetPassword={true}
      />
    </div>
  );
};
