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
import {
  AppTypeEnum,
  BindDidContextValue,
  BindDidProvider,
  BindStepStringEnum,
  WalletInfoType,
} from '../../context';
import { Button, Loading, LoginModal, Modal } from '../../components';
import { Home } from './Home';
import useToggle from '../../hooks/useToggle';

import ss from './index.module.scss';
import cx from 'classnames';
import type { WalletType } from '@web3mq/client';
import { Client } from '@web3mq/client';
import { RenderWallets } from './RenderWallets';
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

type IProps = {
  client?: any;
  url: string;
  containerId: string;
  isShow?: boolean;
  appType?: AppTypeEnum;
  didType: string;
  didValue: string;
  loginBtnNode?: React.ReactNode;
  styles?: Record<string, any>;
  modalClassName?: string;
  handleBindDidEvent: (eventData: any) => void;
  env?: 'dev' | 'test';
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
    handleBindDidEvent,
    env = 'test',
    didValue,
    didType,
    url,
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
  } = useBindDid(client, walletConnectClient, dappConnectClient, appType);
  const { visible, show, hide } = useToggle(isShow);
  const [step, setStep] = useState(BindStepStringEnum.HOME);
  const [showLoading, setShowLoading] = useState(false);
  const [walletInfo, setWalletInfo] = useState<WalletInfoType>();
  const [signTime, setSignTime] = useState<number>();
  const [signContent, setSignContent] = useState<string>();
  const userAccount = useRef<UserAccountType | undefined>();
  const [commonCenterStatusData, setCommonCenterStatusData] = useState<
    CommonCenterStatusIProp | undefined
  >();

  const setConnectLoadingStep = (currentStep: BindStepStringEnum) => {
    setStep(currentStep);
    if (currentStep === BindStepStringEnum.CONNECT_LOADING) {
      setCommonCenterStatusData({
        styles,
        icon: <Loading />,
        title: 'Waiting to connect',
        textContent: 'Confirm this connection in your wallet',
      });
      return;
    } else if (currentStep === BindStepStringEnum.CONNECT_ERROR) {
      setCommonCenterStatusData({
        styles,
        icon: <ConnectErrorIcon />,
        title: 'Error connecting',
        textContent:
          'The connection attempt failed. Please click try again and follow the steps to connect in your wallet.',
        showBtn: true,
        btnText: 'Try Again',
        handleBtnClick: () => {
          setConnectLoadingStep(BindStepStringEnum.HOME);
          setCommonCenterStatusData(undefined);
        },
      });
    } else if (currentStep === BindStepStringEnum.READY_BIND) {
      setCommonCenterStatusData({
        styles,
        icon: <ConnectSuccessIcon />,
        title: '',
        textContent: 'Wallet connection successful',
        addressBox: <RenderWalletAddressBox />,
        showBtn: true,
        customBtn: (
          <Button
            style={styles?.loginButton}
            className={ss.button}
            disabled={showLoading}
            type="primary"
            onClick={handleBindDid}
          >
            Bind wallet
          </Button>
        ),
      });
    } else if (currentStep === BindStepStringEnum.READY_SIGN_UP) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === BindStepStringEnum.VIEW_ALL) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === BindStepStringEnum.HOME) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === BindStepStringEnum.QR_CODE) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === BindStepStringEnum.DID_BINDING) {
      setCommonCenterStatusData({
        styles,
        icon: <Loading />,
        title: 'Waiting for binding',
        textContent: 'Waiting for telegram to bind wallet',
      });
    } else if (currentStep === BindStepStringEnum.DID_BIND_ERROR) {
      setCommonCenterStatusData({
        styles,
        icon: <ConnectErrorIcon />,
        title: 'Bind failure',
        textContent: 'Wallet bind failed, please click back to re-sign',
        showBtn: true,
        btnText: 'Try Again',
        handleBtnClick: () => {
          setConnectLoadingStep(BindStepStringEnum.HOME);
        },
      });
    } else if (currentStep === BindStepStringEnum.SIGN_LOADING) {
      setCommonCenterStatusData({
        styles,
        icon: <Loading />,
        title: 'Waiting for signature',
        textContent: 'Confirm the signature in your wallet',
      });
    } else if (currentStep === BindStepStringEnum.SIGN_ERROR) {
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
            setConnectLoadingStep(BindStepStringEnum.READY_BIND);
          } else {
            setConnectLoadingStep(BindStepStringEnum.READY_SIGN_UP);
          }
        },
      });
    } else if (currentStep === BindStepStringEnum.DID_BIND_SUCCESS) {
      setCommonCenterStatusData({
        styles,
        icon: <ConnectSuccessIcon />,
        title: 'Bind successfully',
        textContent: 'The wallet has been successfully bound to Web3MQ Bot',
        showBtn: true,
        btnText: 'OK',
        handleBtnClick: handleClose,
      });
    } else if (currentStep === BindStepStringEnum.REJECT_CONNECT) {
      setCommonCenterStatusData({
        styles,
        icon: <ConnectErrorIcon />,
        title: 'Error Reject',
        textContent: 'User rejected methods.',
        showBtn: true,
        btnText: 'Try Again',
        handleBtnClick: () => {
          setConnectLoadingStep(BindStepStringEnum.HOME);
        },
      });
    }
  };

  const getAccount = async (didType?: WalletType, didValue?: string) => {
    setShowLoading(true);
    setConnectLoadingStep(BindStepStringEnum.CONNECT_LOADING);
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
      // const { address, userExist } = await getUserAccount(didType, didValue);
      userAccount.current = {
        userid,
        address: address as string,
        walletType: didType || 'eth',
        userExist,
      };
      if (address) {
        if (userExist) {
          setConnectLoadingStep(BindStepStringEnum.READY_BIND);
        } else {
          setConnectLoadingStep(BindStepStringEnum.READY_SIGN_UP);
        }
      } else {
        setConnectLoadingStep(BindStepStringEnum.CONNECT_ERROR);
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
    setConnectLoadingStep(BindStepStringEnum.HOME);
    setCommonCenterStatusData(undefined);
    // if (userAccount) {
    //   if (userAccount.current?.userExist) {
    //     setConnectLoadingStep(BindStepStringEnum.READY_BIND);
    //   } else {
    //     setStep(BindStepStringEnum.READY_SIGN_UP);
    //   }
    // } else {
    //   setStep(BindStepStringEnum.HOME);
    // }
  };
  const handleClose = () => {
    hide();
    // setUserAccount(undefined);
    userAccount.current = undefined;
    setConnectLoadingStep(BindStepStringEnum.HOME);
    setCommonCenterStatusData(undefined);
    setDappConnectClient(undefined);
  };

  useEffect(() => {
    if (signRes && userAccount.current && signTime && signContent) {
      setConnectLoadingStep(BindStepStringEnum.DID_BINDING);
      const params: bindDidV2Params = {
        userid: userAccount.current.userid,
        did_signature: signRes,
        did_type: userAccount.current.walletType,
        did_value: userAccount.current.address,
        timestamp: signTime,
        sign_content: signContent,
        bind_type: didType,
        bind_action: 'bind',
        bind_value: didValue,
      };
      selfRequest(url, params)
        .then((res) => {
          console.log(res, 'res');
          if (res) {
            setConnectLoadingStep(BindStepStringEnum.DID_BIND_SUCCESS);
            res.address = userAccount.current?.address || '';
            handleBindDidEvent(res);
          } else {
            setConnectLoadingStep(BindStepStringEnum.DID_BIND_ERROR);
          }
        })
        .catch((e) => {
          console.log(e, 'e');
          setConnectLoadingStep(BindStepStringEnum.DID_BIND_ERROR);
        });
      console.log('sign success ready bind did');
      handleBindDidEvent(signRes);
    }
  }, [signRes]);

  const handleBack = () => {
    setConnectLoadingStep(BindStepStringEnum.HOME);
    // setUserAccount(undefined);
    userAccount.current = undefined;
    setDappConnectClient(undefined);
    setShowLoading(false);
  };
  const headerTitle = useMemo(() => {
    if (
      step === BindStepStringEnum.HOME ||
      step === BindStepStringEnum.READY_SIGN_UP ||
      step === BindStepStringEnum.CONNECT_LOADING ||
      step === BindStepStringEnum.CONNECT_ERROR
    ) {
      return 'Connect Dapp';
    } else if (step === BindStepStringEnum.QR_CODE) {
      return 'Web3MQ';
    } else if (step === BindStepStringEnum.REJECT_CONNECT) {
      return 'Wallet Connect';
    } else if (step === BindStepStringEnum.VIEW_ALL) {
      return 'Choose Desktop wallets';
    } else if (step === BindStepStringEnum.READY_BIND || step === BindStepStringEnum.SIGN_LOADING) {
      if (didType === 'telegram') {
        return 'Bind Telegram Bot';
      }
      return 'Bind Did';
    } else {
      return 'Connect Dapp';
    }
  }, [step]);

  const ModalHead = () => {
    return (
      <div className={ss.loginModalHead}>
        {step !== BindStepStringEnum.HOME && (
          <CheveronLeft onClick={handleBack} className={ss.backBtn} />
        )}
        <div className={ss.title}>{headerTitle}</div>
        <CloseBtnIcon onClick={handleClose} className={ss.closeBtn} />
      </div>
    );
  };

  const sendSign = async (url = window.location.href) => {
    console.log('send sign');
    console.log(userAccount.current, 'userAccount.current');
    if (!userAccount.current) return;
    const { address, walletType, userid } = userAccount.current;
    let wallet_type_name = walletType === 'starknet' ? 'Argent' : 'Ethereum'; // or StarkNet another wallet
    const timestamp = Date.now();
    // userid = `user:${sha3_224(did_type + did_value + timestamp)}`;
    const NonceContent = sha3_224(
      userid + address + walletType + 'bind' + didType + didValue + timestamp,
    );
    const content = `Web3MQ wants you to sign in with your ${wallet_type_name} account:
${address}
For Web3MQ bind did
URI: ${url}
Version: 1

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
        // setUserAccount({
        //   userid,
        //   address,
        //   walletType: 'eth',
        //   userExist: true,
        // });
        setConnectLoadingStep(BindStepStringEnum.READY_BIND);
      }
      if (eventData.type === 'register') {
        const { address } = eventData.data;
        userAccount.current = {
          userid: userAccount.current?.userid || '',
          address,
          walletType: 'eth',
          userExist: true,
        };
        // setUserAccount({
        //   userid: userAccount?.userid || '',
        //   address,
        //   walletType: 'eth',
        //   userExist: true,
        // });
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
      setConnectLoadingStep(BindStepStringEnum.QR_CODE);
    });
  };

  const handleBindDid = async () => {
    setShowLoading(true);
    setConnectLoadingStep(BindStepStringEnum.SIGN_LOADING);
    try {
      if (dappConnectClient && appType !== 'pc') {
        setTimeout(() => {
          window.open('web3mq://');
        }, 500);
      }
      await sendSign();
      setShowLoading(false);
    } catch (e: any) {
      handleBindDidEvent({
        msg: e.message,
        data: null,
        type: 'error',
      });
      setShowLoading(false);
      setConnectLoadingStep(BindStepStringEnum.SIGN_ERROR);
    }
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

  const bindDidContextValue: BindDidContextValue = useMemo(
    () => ({
      styles,
      showLoading,
      getAccount,
      setWalletInfo,
      setConnectLoadingStep,
    }),
    [showLoading],
  );

  return (
    <BindDidProvider value={bindDidContextValue}>
      <div className={cx(ss.container)}>
        <div onClick={handleModalShow}>
          {loginBtnNode || <Button className={ss.iconBtn}>Bind Did</Button>}
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
            {step === BindStepStringEnum.HOME && (
              <Home
                styles={styles}
                handleWeb3MQClick={handleWeb3mqClick}
                WalletConnectBtnNode={
                  <WalletConnectButton
                    handleClientStep={() => {
                      setConnectLoadingStep(BindStepStringEnum.CONNECT_LOADING);
                    }}
                    handleError={() => {
                      setConnectLoadingStep(BindStepStringEnum.REJECT_CONNECT);
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
            {step === BindStepStringEnum.VIEW_ALL && <RenderWallets />}
            {commonCenterStatusData && <CommonCenterStatus {...commonCenterStatusData} />}
            {step === BindStepStringEnum.READY_SIGN_UP && (
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
            {/*{step === BindStepStringEnum.READY_BIND && userAccount && (*/}
            {/*  <CommonCenterStatus*/}
            {/*    styles={styles}*/}
            {/*    icon={<ConnectSuccessIcon />}*/}
            {/*    title={''}*/}
            {/*    addressBox={<RenderWalletAddressBox />}*/}
            {/*    textContent={'Wallet connection successful'}*/}
            {/*    showBtn={true}*/}
            {/*    customBtn={*/}
            {/*      <Button*/}
            {/*        style={styles?.loginButton}*/}
            {/*        className={ss.button}*/}
            {/*        disabled={showLoading}*/}
            {/*        type="primary"*/}
            {/*        onClick={handleBindDid}*/}
            {/*      >*/}
            {/*        Bind wallet*/}
            {/*      </Button>*/}
            {/*    }*/}
            {/*  />*/}
            {/*)}*/}
            {/*{step === BindStepStringEnum.CONNECT_LOADING && (*/}
            {/*  <CommonCenterStatus*/}
            {/*    styles={styles}*/}
            {/*    icon={<Loading />}*/}
            {/*    title={'Waiting to connect'}*/}
            {/*    textContent={'Confirm this connection in your wallet'}*/}
            {/*  />*/}
            {/*)}*/}
            {/*{step === BindStepStringEnum.CONNECT_ERROR && (*/}
            {/*  <CommonCenterStatus*/}
            {/*    styles={styles}*/}
            {/*    icon={<ConnectErrorIcon />}*/}
            {/*    title={'Error connecting'}*/}
            {/*    textContent={*/}
            {/*      'The connection attempt failed. Please click try again and follow the steps to connect in your wallet.'*/}
            {/*    }*/}
            {/*    showBtn={true}*/}
            {/*    btnText={'Try Again'}*/}
            {/*    handleBtnClick={() => {*/}
            {/*      setStep(BindStepStringEnum.HOME);*/}
            {/*      setCommonCenterStatusData(undefined);*/}
            {/*    }}*/}
            {/*  />*/}
            {/*)}*/}
            {/*{step === BindStepStringEnum.SIGN_LOADING && (*/}
            {/*  <CommonCenterStatus*/}
            {/*    styles={styles}*/}
            {/*    icon={<Loading />}*/}
            {/*    title={'Waiting for signature'}*/}
            {/*    textContent={'Confirm the signature in your wallet'}*/}
            {/*  />*/}
            {/*)}*/}
            {/*{step === BindStepStringEnum.SIGN_ERROR && (*/}
            {/*  <CommonCenterStatus*/}
            {/*    styles={styles}*/}
            {/*    icon={<ConnectErrorIcon />}*/}
            {/*    title={'signature error'}*/}
            {/*    textContent={*/}
            {/*      'The signature attempt failed. Click try again and follow the steps to connect to your wallet.'*/}
            {/*    }*/}
            {/*    showBtn={true}*/}
            {/*    btnText={'Try Again'}*/}
            {/*    handleBtnClick={() => {*/}
            {/*      if (userAccount.current?.userExist) {*/}
            {/*        setConnectLoadingStep(BindStepStringEnum.READY_BIND);*/}
            {/*      } else {*/}
            {/*        setStep(BindStepStringEnum.READY_SIGN_UP);*/}
            {/*      }*/}
            {/*    }}*/}
            {/*  />*/}
            {/*)}*/}
            {/*{step === BindStepStringEnum.REJECT_CONNECT && (*/}
            {/*  <CommonCenterStatus*/}
            {/*    styles={styles}*/}
            {/*    icon={<ConnectErrorIcon />}*/}
            {/*    title={'Error Reject'}*/}
            {/*    textContent={'User rejected methods.'}*/}
            {/*    showBtn={true}*/}
            {/*    btnText={'Try Again'}*/}
            {/*    handleBtnClick={() => {*/}
            {/*      setStep(BindStepStringEnum.HOME);*/}
            {/*    }}*/}
            {/*  />*/}
            {/*)}*/}
            {/*{step === BindStepStringEnum.DID_BIND_SUCCESS && (*/}
            {/*  <CommonCenterStatus*/}
            {/*    styles={styles}*/}
            {/*    icon={<ConnectSuccessIcon />}*/}
            {/*    title={'Bind successfully'}*/}
            {/*    textContent={'The wallet has been successfully bound to Web3MQ Bot'}*/}
            {/*    showBtn={true}*/}
            {/*    btnText={'OK'}*/}
            {/*    handleBtnClick={handleClose}*/}
            {/*  />*/}
            {/*)}*/}
            {/*{step === BindStepStringEnum.DID_BIND_ERROR && (*/}
            {/*  <CommonCenterStatus*/}
            {/*    styles={styles}*/}
            {/*    icon={<ConnectErrorIcon />}*/}
            {/*    title={'Bind failure'}*/}
            {/*    textContent={'Wallet bind failed, please click back to re-sign'}*/}
            {/*    showBtn={true}*/}
            {/*    btnText={'Try Again'}*/}
            {/*    handleBtnClick={() => {*/}
            {/*      setStep(BindStepStringEnum.HOME);*/}
            {/*    }}*/}
            {/*  />*/}
            {/*)}*/}
            {/*{step === BindStepStringEnum.DID_BINDING && (*/}
            {/*  <CommonCenterStatus*/}
            {/*    styles={styles}*/}
            {/*    icon={<Loading />}*/}
            {/*    title={'Waiting for binding'}*/}
            {/*    textContent={'Waiting for telegram to bind wallet'}*/}
            {/*  />*/}
            {/*)}*/}
          </div>
        </Modal>
      </div>
    </BindDidProvider>
  );
};
