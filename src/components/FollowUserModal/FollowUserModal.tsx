import React, { useCallback, useState } from 'react';
import {Client, getUserPublicProfileRequest} from '@web3mq/client';
import { AppTypeEnum } from '../../context';
import { Button } from '../Button';
import { CommonIProps, CommonOperationModal, userPublicProfileType } from '../CommonOperationModal';

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
    propsKeys,
  } = props;
  const [targetUserInfo, setTargetUserInfo] = useState<userPublicProfileType | undefined>();

  // const getTargetUserInfo = async () => {
  //   const userPublicProfileRes = await getUserPublicProfileRequest({
  //     did_type: operationType,
  //     did_value: operationValue,
  //     my_userid: userid,
  //     timestamp: Date.now(),
  //   });
  // };

  const customButton = useCallback(() => {
    if (customBtnNode) {
      return customBtnNode;
    }
    if (!propsKeys) {
      return <Button className="sign_btn">Login to Follow </Button>;
    }
    if (targetUserInfo?.is_my_following) {
      return <Button className="sign_btn"> - UnFollow</Button>;
    } else {
      return <Button className="sign_btn"> + UnFollow</Button>;
    }
  }, [targetUserInfo, customBtnNode]);

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
      customBtnNode={customBtnNode || <Button className="sign_btn">Login to Follow </Button>}
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
