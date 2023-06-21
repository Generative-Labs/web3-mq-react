import React, { useEffect, useMemo, useRef, useState } from 'react';
import type SignClient from '@walletconnect/sign-client';
import {
  BindDidWarningIcon,
  CheveronLeft,
  CloseBtnIcon,
  ConnectDappSuccessIcon,
  ConnectErrorIcon,
  ConnectSuccessIcon,
} from '../../icons';
import { AppTypeEnum } from '../../context';
import { Button, Loading, LoginModal, Modal } from '../../components';
import { Home } from '../LoginModal/Home';
import useToggle from '../../hooks/useToggle';

import ss from './index.module.scss';
import cx from 'classnames';
import type { WalletType } from '@web3mq/client';
import { Client } from '@web3mq/client';
import { RenderWallets } from '../LoginModal/RenderWallets';
import type { DappConnect as DappConnectType } from '@web3mq/dapp-connect';
import { DappConnect, WalletMethodMap } from '@web3mq/dapp-connect';
import { DappConnectModal } from '@web3mq/dapp-connect-react';
import useBindDid, { UserAccountType } from '../CommonOperationModal/hooks/useBindDid';
import moment from 'moment';
import { sha3_224 } from 'js-sha3';
import type { AuthStatusType, AuthToDappParams } from '../../utils';
import { AuthToDappEnum, getShortAddress, selfRequest } from '../../utils';
import { WalletConnectButton } from '../WalletConnectButton';
import { CommonCenterStatus, CommonCenterStatusIProp } from '../LoginModal/loginLoading';
import { StepStringEnum, WalletInfoType } from '../../types/enum';
import type { CommonIProps } from '../CommonOperationModal';

type authScopeItem = Record<string, 'on' | 'off'>;

interface IProps extends CommonIProps {
  url: string;
  fastestUrl: string;
  dappId: string;
  authScopesType?: string;
  authScopesStatus?: AuthStatusType;
  authAudit?: AuthToDappEnum;
  propsAuthScopes?: authScopeItem;
}

export const AuthToReceiveModal: React.FC<IProps> = (props) => {
  const {
    isShow,
    client = Client as any,
    appType = window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc'],
    containerId,
    customBtnNode = null,
    styles = null,
    modalClassName = '',
    handleOperationEvent,
    env = 'test',
    dappId,
    url,
    authAudit = AuthToDappEnum.ON,
    authScopesStatus = 'on',
    authScopesType = 'Web3MQ/user.message:receive',
    fastestUrl,
    propsUserAccount,
    propWalletConnectClient,
    propDappConnectClient,
    propWcSession,
    propsAuthScopes,
  } = props;
  const [dappConnectClient, setDappConnectClient] = useState<DappConnectType | undefined>(
    propDappConnectClient,
  );
  const walletConnectClient = useRef<SignClient>();
  if (propWalletConnectClient) {
    walletConnectClient.current = propWalletConnectClient;
  }
  const {
    wcSession,
    normalSign,
    create,
    connect,
    closeModal,
    onSessionConnected,
    web3MqSignCallback,
    sendSignByDappConnect,
    sendSignByWalletConnect,
    signRes,
    didPubKey,
  } = useBindDid(client, walletConnectClient, dappConnectClient, appType, propWcSession);
  let authScopes = {
    [authScopesType]: authScopesStatus,
  };
  if (propsAuthScopes) {
    authScopes = propsAuthScopes;
  }

  const { visible, show, hide } = useToggle(isShow);
  const userAccount = useRef<UserAccountType | undefined>(propsUserAccount);
  const loginStatus = useRef<any>();
  const [step, setStep] = useState(
    propsUserAccount ? StepStringEnum.READY_AUTH_TO_DAPP : StepStringEnum.HOME,
  );
  const [showLoading, setShowLoading] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfoType>();
  const [signTime, setSignTime] = useState<number>();
  const [signContent, setSignContent] = useState<string>();

  const [commonCenterStatusData, setCommonCenterStatusData] = useState<
    CommonCenterStatusIProp | undefined
  >();

  const setConnectLoadingStep = (currentStep: StepStringEnum) => {
    setStep(currentStep);
    if (currentStep === StepStringEnum.CONNECT_LOADING) {
      setCommonCenterStatusData({
        styles,
        icon: <Loading />,
        title: 'Waiting to connect',
        textContent: 'Confirm this connection in your wallet',
      });
      return;
    } else if (currentStep === StepStringEnum.CONNECT_ERROR) {
      setCommonCenterStatusData({
        styles,
        icon: <ConnectErrorIcon />,
        title: 'Error connecting',
        textContent:
          'The connection attempt failed. Please click try again and follow the steps to connect in your wallet.',
        showBtn: true,
        btnText: 'Try Again',
        handleBtnClick: () => {
          setConnectLoadingStep(StepStringEnum.HOME);
          setCommonCenterStatusData(undefined);
        },
      });
    } else if (currentStep === StepStringEnum.VIEW_ALL) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.HOME) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.QR_CODE) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.READY_AUTH_TO_DAPP) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.READY_SIGN_UP) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.SIGN_LOADING) {
      setCommonCenterStatusData({
        styles,
        icon: <Loading />,
        title: 'Waiting for signature',
        textContent: 'Confirm the signature in your wallet',
      });
    } else if (currentStep === StepStringEnum.SIGN_ERROR) {
      setCommonCenterStatusData({
        styles,
        icon: <ConnectErrorIcon />,
        title: 'Signature error',
        textContent:
          'The signature attempt failed. Click try again and follow the steps to connect to your wallet.',
        showBtn: true,
        btnText: 'Try Again',
        handleBtnClick: () => {
          if (userAccount.current?.userExist) {
            setConnectLoadingStep(StepStringEnum.READY_AUTH_TO_DAPP);
          } else {
            setConnectLoadingStep(StepStringEnum.READY_SIGN_UP);
          }
        },
      });
    } else if (currentStep === StepStringEnum.REJECT_CONNECT) {
      setCommonCenterStatusData({
        styles,
        icon: <ConnectErrorIcon />,
        title: 'Error Reject',
        textContent: 'User rejected methods.',
        showBtn: true,
        btnText: 'Try Again',
        handleBtnClick: () => {
          setConnectLoadingStep(StepStringEnum.HOME);
        },
      });
    } else if (currentStep === StepStringEnum.AUTH_DAPP_SUCCESS) {
      let title = 'Authorization successful';
      let textContent = 'You have successfully authorized dapp';
      setCommonCenterStatusData({
        styles,
        icon: <ConnectSuccessIcon />,
        title,
        textContent,
        showBtn: true,
        btnText: 'OK',
        handleBtnClick: handleClose,
      });
    } else if (currentStep === StepStringEnum.AUTH_DAPP_ERROR) {
      let title = 'Authorization failure';
      let textContent = 'DApp access failed, please click back to re-sign ';
      setCommonCenterStatusData({
        styles,
        icon: <ConnectErrorIcon />,
        title,
        textContent,
        showBtn: true,
        btnText: 'Try Again',
        handleBtnClick: () => {
          setConnectLoadingStep(StepStringEnum.HOME);
        },
      });
    } else if (currentStep === StepStringEnum.AUTHING) {
      let title = 'Waiting for accessing';
      let textContent = 'Waiting for DApp access your Web3MQ account ';
      setCommonCenterStatusData({
        styles,
        icon: <Loading />,
        title,
        textContent,
      });
    }
  };

  const getAccount = async (didType?: WalletType, didValue?: string) => {
    setShowLoading(true);
    setConnectLoadingStep(StepStringEnum.CONNECT_LOADING);
    try {
      let address = didValue;
      if (!address) {
        const data = await client.register.getAccount(didType);
        address = data.address;
      }
      const { userid, userExist } = await client.register.getUserInfo({
        did_value: address,
        did_type: didType,
      });
      userAccount.current = {
        userid,
        address: address as string,
        walletType: didType || 'eth',
        userExist,
      };
      if (address) {
        if (userExist) {
          setConnectLoadingStep(StepStringEnum.READY_AUTH_TO_DAPP);
        } else {
          setConnectLoadingStep(StepStringEnum.READY_SIGN_UP);
        }
      } else {
        setConnectLoadingStep(StepStringEnum.CONNECT_ERROR);
      }
      setShowLoading(false);
    } catch (e) {
      console.log(e, 'e - getAccount');
      setShowLoading(false);
    }
  };
  const handleWeb3mqCallback = async (eventData: any) => {
    const { method, result } = eventData;
    if (method === WalletMethodMap.providerAuthorization) {
      setWalletInfo({
        name: result?.walletInfo?.name || 'Web3MQ Wallet',
        type: 'web3mq',
      });
      await getAccount('eth', result.address.toLowerCase());
    }
    if (method === WalletMethodMap.personalSign) {
      await web3MqSignCallback(result.signature);
    }
  };
  const handleModalShow = async () => {
    show();
    if (userAccount.current) {
      if (userAccount.current?.userExist) {
        setConnectLoadingStep(StepStringEnum.READY_AUTH_TO_DAPP);
      } else {
        setConnectLoadingStep(StepStringEnum.READY_SIGN_UP);
      }
    } else {
      setConnectLoadingStep(StepStringEnum.HOME);
    }
  };
  const handleClose = () => {
    hide();
    userAccount.current = undefined;
    setConnectLoadingStep(StepStringEnum.HOME);
    setCommonCenterStatusData(undefined);
    setDappConnectClient(undefined);
  };

  useEffect(() => {
    if (signRes && userAccount.current && signTime && signContent) {
      setConnectLoadingStep(StepStringEnum.AUTHING);
      const { userid, address, walletType } = userAccount.current;
      const authParams: AuthToDappParams = {
        userid,
        dapp_id: dappId,
        scopes: authScopes,
        timestamp: signTime,
        signature_content: signContent,
        did_signature: signRes,
        did_type: walletType,
        auth_status: AuthToDappEnum.ON,
        did_value: address,
        did_pubkey: didPubKey,
      };
      selfRequest(url, authParams)
        .then((res) => {
          if (res) {
            setConnectLoadingStep(StepStringEnum.AUTH_DAPP_SUCCESS);
            res.address = userAccount.current?.address || '';
            handleOperationEvent({
              ...res,
              operation_type: 'auth_to_dapp',
              loginStatus: loginStatus.current,
            });
          } else {
            setConnectLoadingStep(StepStringEnum.AUTH_DAPP_ERROR);
          }
        })
        .catch((e) => {
          console.log(e, 'e');
          setConnectLoadingStep(StepStringEnum.AUTH_DAPP_ERROR);
        });
    }
  }, [signRes]);

  const handleBack = () => {
    setConnectLoadingStep(StepStringEnum.HOME);
    userAccount.current = undefined;
    setDappConnectClient(undefined);
    setShowLoading(false);
  };
  const headerTitle = useMemo(() => {
    if (
      step === StepStringEnum.HOME ||
      step === StepStringEnum.READY_SIGN_UP ||
      step === StepStringEnum.CONNECT_LOADING ||
      step === StepStringEnum.CONNECT_ERROR
    ) {
      return 'Connect Dapp';
    } else if (step === StepStringEnum.QR_CODE) {
      return 'Web3MQ';
    } else if (step === StepStringEnum.REJECT_CONNECT) {
      return 'Wallet Connect';
    } else if (step === StepStringEnum.VIEW_ALL) {
      return 'Choose Desktop wallets';
    } else if (
      [
        StepStringEnum.READY_AUTH_TO_DAPP,
        StepStringEnum.AUTH_DAPP_SUCCESS,
        StepStringEnum.AUTH_DAPP_ERROR,
        StepStringEnum.AUTHING,
      ].includes(step)
    ) {
      return 'Authorize Dapp';
    } else {
      return 'Connect Dapp';
    }
  }, [step]);

  const ModalHead = () => {
    return (
      <div className={ss.loginModalHead}>
        {step !== StepStringEnum.HOME && (
          <CheveronLeft onClick={handleBack} className={ss.backBtn} />
        )}
        <div className={ss.title}>{headerTitle}</div>
        <CloseBtnIcon onClick={handleClose} className={ss.closeBtn} />
      </div>
    );
  };

  const sendSign = async (url = window.location.href) => {
    if (!userAccount.current) return;
    const { address, walletType, userid } = userAccount.current;
    const timestamp = Date.now();
    let NonceContent = '';
    if (authScopesStatus === 'clear') {
      NonceContent = sha3_224(userid + dappId + authAudit + timestamp);
    } else {
      NonceContent = sha3_224(userid + dappId + authAudit + JSON.stringify(authScopes) + timestamp);
    }

    const content = `
DApp want to access your 
       Web3MQ account : ${getShortAddress(userid, 6, 6)}
    
Auth Scopes: Receive your Web3MQ notification 
URI: ${url}
Nonce: ${NonceContent}
Issued At: ${moment().utc().local().format('DD/MM/YYYY hh:mm')}`;
    setSignContent(content);
    setSignTime(timestamp);
    if (dappConnectClient) {
      await sendSignByDappConnect(content, address);
    } else if (walletConnectClient.current) {
      await sendSignByWalletConnect(content, address);
    } else {
      await normalSign(content, address, walletType);
    }
  };

  const handleLoginEvent = (eventData: any) => {
    if (eventData.data) {
      if (eventData.type === 'login') {
        const { userid, address } = eventData.data;
        userAccount.current = {
          userid,
          address,
          walletType: 'eth',
          userExist: true,
        };
        loginStatus.current = eventData.data;
        setConnectLoadingStep(StepStringEnum.READY_AUTH_TO_DAPP);
      }
      if (eventData.type === 'register') {
        const { address } = eventData.data;
        userAccount.current = {
          userid: userAccount.current?.userid || '',
          address,
          walletType: 'eth',
          userExist: true,
        };
      }
    }
  };

  const handleWeb3mqClick = () => {
    new Promise((resolve) => {
      setDappConnectClient(
        new DappConnect({ dAppID: 'SwapChat:im', keepAlive: false, env }, () => {}),
      );
      resolve('success');
    }).then(() => {
      setConnectLoadingStep(StepStringEnum.QR_CODE);
    });
  };

  const handleAuthClick = async () => {
    setShowLoading(true);
    setConnectLoadingStep(StepStringEnum.SIGN_LOADING);
    try {
      if (dappConnectClient && appType !== 'pc') {
        setTimeout(() => {
          window.open('web3mq://');
        }, 500);
      }
      await sendSign();
      setShowLoading(false);
    } catch (e: any) {
      handleOperationEvent({
        msg: e.message,
        data: null,
        type: 'error',
      });
      setShowLoading(false);
      setConnectLoadingStep(StepStringEnum.SIGN_ERROR);
    }
  };
  const handleWalletClick = async (name: string, type: string) => {
    setWalletInfo({
      name: name,
      type: type as 'eth' | 'starknet' | 'web3mq' | 'walletConnect',
    });
    await getAccount(type as WalletType);
  };

  return (
    <div className={cx(ss.container)} style={styles?.modalContainer}>
      <div onClick={handleModalShow} style={styles?.btnBox}>
        {customBtnNode || <Button className={ss.iconBtn}>Auth to dapp</Button>}
      </div>
      <Modal
        dialogClassName={cx(modalClassName)}
        containerId={containerId}
        appType={appType}
        visible={visible}
        modalHeader={<ModalHead />}
        closeModal={hide}
      >
        <div className={cx(ss.modalBody)} style={styles?.modalBody}>
          {step === StepStringEnum.HOME && (
            <Home
              RenderWallets={
                <RenderWallets
                  handleViewAll={() => {
                    setConnectLoadingStep(StepStringEnum.VIEW_ALL);
                  }}
                  styles={styles}
                  showLoading={showLoading}
                  showCount={3}
                  handleWalletClick={handleWalletClick}
                />
              }
              styles={styles}
              handleWeb3MQClick={handleWeb3mqClick}
              WalletConnectBtnNode={
                <WalletConnectButton
                  handleClientStep={() => {
                    setConnectLoadingStep(StepStringEnum.CONNECT_LOADING);
                  }}
                  handleError={() => {
                    setConnectLoadingStep(StepStringEnum.REJECT_CONNECT);
                  }}
                  handleConnectEvent={async (event) => {
                    setWalletInfo({
                      name: event.walletName,
                      type: event.walletType,
                    });
                    await getAccount('eth', event.address);
                  }}
                  create={create}
                  connect={connect}
                  closeModal={closeModal}
                  onSessionConnected={onSessionConnected}
                />
              }
            />
          )}
          {dappConnectClient && (
            <DappConnectModal
              client={dappConnectClient as DappConnect}
              handleSuccess={handleWeb3mqCallback}
              appType={appType}
            />
          )}
          {step === StepStringEnum.VIEW_ALL && (
            <RenderWallets
              handleViewAll={() => {
                setConnectLoadingStep(StepStringEnum.VIEW_ALL);
              }}
              styles={styles}
              showLoading={showLoading}
              handleWalletClick={handleWalletClick}
            />
          )}

          {step === StepStringEnum.READY_AUTH_TO_DAPP && (
            <CommonCenterStatus
              styles={styles}
              icon={<BindDidWarningIcon />}
              title={'This service is provided by Dapp'}
              textContent={'You need to provide the following authorizations to proceed'}
              showBtn={true}
              customBtn={
                <Button
                  className={ss.button}
                  disabled={showLoading}
                  type="primary"
                  onClick={handleAuthClick}
                >
                  Authorize
                </Button>
              }
              authToDappList={
                <div className={ss.authToDappList}>
                  <ConnectDappSuccessIcon style={{ marginRight: '15px' }} />
                  <div className={ss.authToDappRight}>
                    <div className={ss.title}>Receive: notifications</div>
                    <div className={ss.subTitle}>
                      Receive message notifications on your behalf and forward them to telegram
                    </div>
                  </div>
                </div>
              }
            />
          )}

          {step === StepStringEnum.READY_SIGN_UP && (
            <CommonCenterStatus
              styles={styles}
              icon={<BindDidWarningIcon />}
              title={'Wallet address not registered'}
              textContent={'Your wallet address is not registered to the web3mq network'}
              showBtn={true}
              customBtn={
                <LoginModal
                  client={client}
                  env={env}
                  handleOperationEvent={handleLoginEvent}
                  containerId={containerId}
                  appType={appType}
                  customBtnNode={<Button type={'primary'}>Sign Up</Button>}
                  propsUserAccount={userAccount.current}
                  propWalletConnectClient={walletConnectClient.current}
                  propWcSession={wcSession.current}
                  propDappConnectClient={dappConnectClient}
                />
              }
            />
          )}
          {commonCenterStatusData && <CommonCenterStatus {...commonCenterStatusData} />}
        </div>
      </Modal>
    </div>
  );
};
