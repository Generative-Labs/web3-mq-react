import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type SignClient from '@walletconnect/sign-client';
import {
  ArgentXIcon,
  BindDidWarningIcon,
  CheveronLeft,
  CloseBtnIcon,
  ConnectErrorIcon,
  ConnectSuccessIcon,
  MetaMaskIcon,
  WalletConnectIcon,
  Web3MqWalletIcon,
} from '../../icons';
import { AppTypeEnum } from '../../context';
import { AuthToReceiveModal, Button, Loading, LoginModal, Modal } from '../../components';
import { Home } from '../LoginModal/Home';
import useToggle from '../../hooks/useToggle';

import ss from './index.module.scss';
import cx from 'classnames';
import type { FollowOperationApiParams, WalletType } from '@web3mq/client';
import { Client, getUserPublicProfileRequest } from '@web3mq/client';
import { RenderWallets } from '../LoginModal/RenderWallets';
import type { DappConnect as DappConnectType } from '@web3mq/dapp-connect';
import { DappConnect, WalletMethodMap } from '@web3mq/dapp-connect';
import { DappConnectModal } from '@web3mq/dapp-connect-react';
import useBindDid, { UserAccountType } from './hooks/useBindDid';
import moment from 'moment';
import { sha3_224 } from 'js-sha3';
import type { bindDidV2Params } from '../../utils';
import { getShortAddress, selfRequest } from '../../utils';
import { WalletConnectButton } from '../WalletConnectButton';
import { CommonCenterStatus, CommonCenterStatusIProp } from '../LoginModal/loginLoading';
import { StepStringEnum, WalletInfoType } from '../../types/enum';

type IProps = {
  client?: any;
  url: string;
  fastestUrl: string;
  containerId: string;
  isShow?: boolean;
  appType?: AppTypeEnum;
  loginBtnNode?: React.ReactNode;
  styles?: Record<string, any>;
  modalClassName?: string;
  env?: 'dev' | 'test';
  handleOperationEvent: (eventData: any) => void;
  operationType: string;
  operationValue: string;
  operationMode?: 'bind_did' | 'follow_user';
};

export type didItemType = {
  did_type: string;
  did_value: string;
  provider_id: string;
  bind_type: string;
  bind_value: string;
  bind_name?: string;
};

export type userPublicProfileType = {
  avatar_url: string;
  bind_did_list: didItemType[];
  is_my_following: boolean;
  nickname: string;
  stats: {
    total_followers: number;
    total_following: number;
  };
  timestamp: number;
  userid: string;
  wallet_address: string;
  wallet_type: string;
};

export const BindDidModal: React.FC<IProps> = (props) => {
  const [dappConnectClient, setDappConnectClient] = useState<DappConnectType>();
  const walletConnectClient = useRef<SignClient>();
  const {
    isShow,
    client = Client as any,
    appType = window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc'],
    containerId,
    loginBtnNode = null,
    styles = null,
    modalClassName = '',
    handleOperationEvent,
    env = 'test',
    operationValue,
    operationType,
    operationMode = 'bind_did',
    url,
    fastestUrl,
  } = props;
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
  } = useBindDid(client, walletConnectClient, dappConnectClient, appType);
  const { visible, show, hide } = useToggle(isShow);
  const [step, setStep] = useState(StepStringEnum.HOME);
  const [showLoading, setShowLoading] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfoType>();
  const [signTime, setSignTime] = useState<number>();
  const [signContent, setSignContent] = useState<string>();
  const userAccount = useRef<UserAccountType | undefined>();
  const targetUserAccount = useRef<userPublicProfileType | undefined>();
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
    } else if (currentStep === StepStringEnum.READY_BIND) {
      let title = '';
      let textContent = 'Wallet connection successful';
      let icon = <ConnectSuccessIcon />;
      let addressBox = <RenderWalletAddressBox />;
      let Btn = (
        <Button
          style={styles?.loginButton}
          className={ss.button}
          disabled={showLoading}
          type="primary"
          onClick={handleBindDid}
        >
          Bind wallet
        </Button>
      );
      if (operationMode === 'follow_user') {
        if (targetUserAccount.current?.is_my_following) {
          addressBox = <></>;
          title = 'Following User';
          textContent = 'Already following user, whether to unfollow';
          Btn = (
            <Button
              style={{
                background: '#fff',
                color: '#EF4343',
                border: '1px solid #FEE1E1',
                borderRadius: '6px',
              }}
              className={ss.button}
              disabled={showLoading}
              type="primary"
              onClick={handleBindDid}
            >
              - Unfollow
            </Button>
          );
        } else {
          Btn = (
            <Button
              style={styles?.loginButton}
              className={ss.button}
              disabled={showLoading}
              type="primary"
              onClick={handleBindDid}
            >
              + Follow
            </Button>
          );
        }
      }
      setCommonCenterStatusData({
        styles,
        icon,
        title,
        textContent,
        addressBox,
        showBtn: true,
        customBtn: Btn,
      });
    } else if (currentStep === StepStringEnum.READY_SIGN_UP) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.VIEW_ALL) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.HOME) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.QR_CODE) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.DID_BINDING) {
      let title = 'Waiting for binding';
      let textContent = 'Waiting for telegram to bind wallet';
      if (operationMode === 'follow_user') {
        title = 'Waiting for following';
        textContent = 'Waiting for follow user';
        if (targetUserAccount.current?.is_my_following) {
          title = 'Waiting for unfollowing';
          textContent = 'Waiting for unfollow user';
        }
      }
      setCommonCenterStatusData({
        styles,
        icon: <Loading />,
        title,
        textContent,
      });
    } else if (currentStep === StepStringEnum.DID_BIND_ERROR) {
      let title = 'Bind failure';
      let textContent = 'Wallet bind failed, please click back to re-sign';
      if (operationMode === 'follow_user') {
        title = 'Follow failure';
        textContent = 'Follow user failed, please click back to re-sign';
        if (targetUserAccount.current?.is_my_following) {
          title = 'Unfollow failure';
          textContent = 'Unfollow user failed, please click back to re-sign';
        }
      }
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
            setConnectLoadingStep(StepStringEnum.READY_BIND);
          } else {
            setConnectLoadingStep(StepStringEnum.READY_SIGN_UP);
          }
        },
      });
    } else if (currentStep === StepStringEnum.DID_BIND_SUCCESS) {
      let title = 'Bind successfully';
      let textContent = 'The wallet has been successfully bound to Web3MQ Bot';
      if (operationMode === 'follow_user') {
        title = 'Follow successfully';
        textContent = `Follow ${getShortAddress(operationValue, 6, 4)} Success`;
        if (targetUserAccount.current?.is_my_following) {
          title = 'Unfollow successfully';
          textContent = `Unfollow ${getShortAddress(operationValue, 6, 4)} Success`;
        }
      }
      setCommonCenterStatusData({
        styles,
        icon: <ConnectSuccessIcon />,
        title,
        textContent,
        showBtn: true,
        btnText: 'OK',
        handleBtnClick: handleClose,
        customBtn: (
          <div className={ss.successBtns}>
            <Button className={ss.okBtn} onClick={handleClose}>
              OK
            </Button>
            <AuthToReceiveModal
              client={client}
              env={env}
              handleOperationEvent={() => {
                console.log('success');
                setConnectLoadingStep(StepStringEnum.AUTH_DAPP_SUCCESS);
              }}
              url={`${fastestUrl}/api/dapp/user_auth/`}
              fastestUrl={fastestUrl}
              propsUserAccount={userAccount.current}
              dappId={'web3mq:push-server-v1'}
              containerId={containerId}
              appType={appType}
              customBtn={
                <Button className={ss.authBtn} type={'primary'}>
                  To authorize
                </Button>
              }
              propWalletConnectClient={walletConnectClient.current}
              propWcSession={wcSession.current}
              propDappConnectClient={dappConnectClient}
              styles={{
                btnBox: {
                  width: '100%',
                },
                modalContainer: {
                  width: '100%',
                },
              }}
            />
          </div>
        ),
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
      if (operationMode === 'follow_user') {
        const userPublicProfileRes = await getUserPublicProfileRequest({
          did_type: operationType,
          did_value: operationValue,
          my_userid: userid,
          timestamp: Date.now(),
        });
        if (userPublicProfileRes && userPublicProfileRes.data) {
          targetUserAccount.current = userPublicProfileRes.data;
        }
      }
      if (address) {
        if (userExist) {
          setConnectLoadingStep(StepStringEnum.READY_BIND);
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
    setConnectLoadingStep(StepStringEnum.HOME);
    setCommonCenterStatusData(undefined);
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
      setConnectLoadingStep(StepStringEnum.DID_BINDING);
      const { userid, address, walletType } = userAccount.current;
      if (operationMode === 'follow_user' && targetUserAccount.current) {
        const params: FollowOperationApiParams = {
          did_pubkey: didPubKey,
          did_signature: signRes,
          sign_content: signContent,
          userid,
          timestamp: signTime,
          address,
          action: targetUserAccount.current.is_my_following ? 'cancel' : 'follow',
          did_type: walletType,
          target_userid: targetUserAccount.current.userid,
        };
        selfRequest(url, params)
          .then((res) => {
            console.log(res, 'FollowOperationApiParams - res');
            if (res) {
              setConnectLoadingStep(StepStringEnum.DID_BIND_SUCCESS);
              res.address = userAccount.current?.address || '';
              handleOperationEvent(res);
            } else {
              setConnectLoadingStep(StepStringEnum.DID_BIND_ERROR);
            }
          })
          .catch((e) => {
            console.log(e, 'e');
            setConnectLoadingStep(StepStringEnum.DID_BIND_ERROR);
          });
      } else {
        const bindParams: bindDidV2Params = {
          userid,
          did_signature: signRes,
          did_type: walletType,
          did_value: address,
          timestamp: signTime,
          sign_content: signContent,
          bind_type: operationType,
          bind_action: 'bind',
          bind_value: operationValue,
        };
        selfRequest(url, bindParams)
          .then((res) => {
            console.log(res, 'res');
            if (res) {
              setConnectLoadingStep(StepStringEnum.DID_BIND_SUCCESS);
              res.address = userAccount.current?.address || '';
              handleOperationEvent(res);
            } else {
              setConnectLoadingStep(StepStringEnum.DID_BIND_ERROR);
            }
          })
          .catch((e) => {
            console.log(e, 'e');
            setConnectLoadingStep(StepStringEnum.DID_BIND_ERROR);
          });
      }
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
    } else if (step === StepStringEnum.READY_BIND || step === StepStringEnum.SIGN_LOADING) {
      if (operationMode === 'follow_user') {
        return 'Follow User';
      } else {
        if (operationType === 'telegram') {
          return 'Bind Telegram Bot';
        }
        return 'Bind Did';
      }
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
    let wallet_type_name = walletType === 'starknet' ? 'Argent' : 'Ethereum'; // or StarkNet another wallet
    const timestamp = Date.now();
    let NonceContent = sha3_224(
      userid + address + walletType + 'bind' + operationType + operationValue + timestamp,
    );
    let content = `Web3MQ wants you to sign in with your ${wallet_type_name} account:
${address}
For Web3MQ bind did
URI: ${url}
Version: 1

Nonce: ${NonceContent}
Issued At: ${moment().utc().local().format('DD/MM/YYYY hh:mm')}`;

    if (operationMode === 'follow_user') {
      let nonce = sha3_224(userid + operationType + operationValue + timestamp);
      content = `
    Web3MQ wants you to sign in with your ${wallet_type_name} account:
    ${address}
    For follow signature
    URI: ${url}
    
    Nonce: ${nonce}
    Issued At: ${moment().utc().local().format('DD/MM/YYYY hh:mm')}`;
    }
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
        setConnectLoadingStep(StepStringEnum.READY_BIND);
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

  const handleBindDid = async () => {
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

  const RenderWalletAddressBox = useCallback(() => {
    return (
      <div className={cx(ss.addressBox)} style={styles?.addressBox}>
        {walletInfo?.type ? (
          walletInfo.type === 'web3mq' ? (
            <Web3MqWalletIcon />
          ) : walletInfo.type === 'starknet' ? (
            <ArgentXIcon />
          ) : walletInfo.type === 'eth' ? (
            <MetaMaskIcon />
          ) : (
            <WalletConnectIcon style={{ height: '21px' }} />
          )
        ) : (
          <MetaMaskIcon />
        )}
        <div className={ss.centerText}>{walletInfo?.name || 'MetaMask'}</div>
        <div className={ss.addressText}>{getShortAddress(userAccount.current?.address || '')}</div>
      </div>
    );
  }, [JSON.stringify(walletInfo), userAccount.current]);

  return (
    <div className={cx(ss.container)} style={styles?.modalContainer}>
      <div onClick={handleModalShow} style={styles?.btnBox}>
        {loginBtnNode || (
          <Button className={ss.iconBtn}>
            {operationMode === 'follow_user' ? 'Follow Modal' : 'Bind Did'}
          </Button>
        )}
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
          {commonCenterStatusData && <CommonCenterStatus {...commonCenterStatusData} />}
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
                  handleLoginEvent={handleLoginEvent}
                  containerId={containerId}
                  appType={appType}
                  account={userAccount.current}
                  loginBtnNode={<Button type={'primary'}>Sign Up</Button>}
                  propWalletConnectClient={walletConnectClient.current}
                  propWcSession={wcSession.current}
                  propDappConnectClient={dappConnectClient}
                />
              }
            />
          )}
        </div>
      </Modal>
    </div>
  );
};
