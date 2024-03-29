import React, { useCallback, useEffect, useState } from 'react';
import { Client, getUserPublicProfileRequest, KeyPairsType } from '@web3mq/client';
import { AppTypeEnum } from '../../context';
import { Button } from '../Button';
import { CommonIProps, CommonOperationModal, userPublicProfileType } from '../CommonOperationModal';
import ss from './index.module.scss';
import { PlusIcon } from '../../icons/PlusIcon';

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
    auditBtnSize = 'large',
  } = props;
  const [targetUserInfo, setTargetUserInfo] = useState<userPublicProfileType | undefined>();

  const getTargetUserInfo = async () => {
    const userPublicProfileRes = await getUserPublicProfileRequest({
      did_type: targetWalletType,
      did_value: targetWalletAddress,
      my_userid: propsKeys?.userid || '',
      timestamp: Date.now(),
    });
    if (userPublicProfileRes && userPublicProfileRes.data) {
      setTargetUserInfo(userPublicProfileRes.data);
    }
  };

  useEffect(() => {
    if (propsKeys) {
      getTargetUserInfo().then();
    }
  }, []);

  const handleEvent = async (eventData: any) => {
    await handleOperationEvent(eventData);
    await getTargetUserInfo();
  };
  const CustomButton = useCallback(() => {
    if (!propsKeys) {
      return (
        <Button size={auditBtnSize} className={ss.loginBtn}>
          Login to Follow{' '}
        </Button>
      );
    }
    if (targetUserInfo?.is_my_following) {
      return <Button size={auditBtnSize} className={ss.unFollowBtn}></Button>;
    } else {
      return (
        <Button
          size={auditBtnSize}
          className={ss.followBtn}
          type="primary"
          icon={<PlusIcon style={{ width: '21px', height: '20px', margin: '0' }} />}
        >
          Follow
        </Button>
      );
    }
  }, [targetUserInfo, customBtnNode, JSON.stringify(targetUserInfo)]);

  return (
    <CommonOperationModal
      env={env}
      modalClassName={modalClassName}
      styles={styles}
      containerId={containerId}
      client={client}
      isShow={isShow}
      handleOperationEvent={handleEvent}
      appType={appType}
      customBtnNode={customBtnNode || <CustomButton />}
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
