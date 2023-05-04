import React from 'react';
import { Client } from '@web3mq/client';
import { AppTypeEnum } from '../../context';
import { Button } from '../Button';
import { CommonIProps, CommonOperationModal } from '../CommonOperationModal';

interface IProps extends CommonIProps {
  url: string;
  fastestUrl: string;
  targetWalletType: string;
  targetWalletAddress: string;
}

export const FollowUserModal: React.FC<IProps> = (props) => {
  const {
    isShow,
    client = Client as any,
    appType = window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc'],
    containerId,
    customBtnNode = null,
    styles,
    modalClassName = '',
    handleOperationEvent,
    env = 'test',
    propDappConnectClient,
    propWalletConnectClient,
    propWcSession,
    propsUserAccount,
    url,
    fastestUrl,
    targetWalletType,
    targetWalletAddress,
  } = props;

  return (
    <CommonOperationModal
      env={env}
      modalClassName={modalClassName}
      styles={styles}
      containerId={containerId}
      client={client}
      isShow={isShow}
      handleOperationEvent={handleOperationEvent}
      appType={appType}
      customBtnNode={customBtnNode || <Button className="sign_btn">Follow </Button>}
      propDappConnectClient={propDappConnectClient}
      propWalletConnectClient={propWalletConnectClient}
      propWcSession={propWcSession}
      propsUserAccount={propsUserAccount}
      fastestUrl={fastestUrl}
      url={url}
      operationMode={'follow_user'}
      operationValue={targetWalletAddress}
      operationType={targetWalletType}
    />
  );
};
