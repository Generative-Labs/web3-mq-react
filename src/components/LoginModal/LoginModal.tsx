import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type SignClient from '@walletconnect/sign-client';
import {
  ArgentXIcon,
  BraavosIcon,
  CheveronLeft,
  CloseBtnIcon,
  ConnectErrorIcon,
  MetaMaskIcon,
  WalletConnectIcon,
  Web3MqWalletIcon,
} from '../../icons';
import { AppTypeEnum } from '../../context';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { Home } from './Home';
import { CommonCenterStatus, CommonCenterStatusIProp } from './loginLoading';
import useToggle from '../../hooks/useToggle';

import ss from './index.module.scss';
import cx from 'classnames';
import type { WalletType } from '@web3mq/client';
import { Client, WalletNameType } from '@web3mq/client';
import { RenderWallets } from './RenderWallets';
import useLogin, { MainKeysType } from './hooks/useLogin';
import type { DappConnect as DappConnectType } from '@web3mq/dapp-connect';
import { DappConnect, WalletMethodMap } from '@web3mq/dapp-connect';
import { DappConnectModal } from '@web3mq/dapp-connect-react';
import { WalletConnectButton } from '../WalletConnectButton';
import { Loading } from '../Loading';
import { getShortAddress } from '../../utils';
import { StepStringEnum, WalletInfoType, WalletNameMap } from '../../types/enum';
import type { CommonIProps } from '../CommonOperationModal';

interface IProps extends CommonIProps {
  isResetPassword?: boolean;
  showWeb3MQBtn?: boolean;
  keys?: MainKeysType;
}

export const LoginModal: React.FC<IProps> = (props) => {
  const {
    isShow,
    client = Client as any,
    appType = window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc'],
    containerId,
    customBtnNode = null,
    propsUserAccount = undefined,
    styles = null,
    modalClassName = '',
    handleOperationEvent,
    keys = undefined,
    env = 'test',
    propWcSession,
    propWalletConnectClient,
    propDappConnectClient,
    isResetPassword = false,
    showWeb3MQBtn = false,
  } = props;

  const [dappConnectClient, setDappConnectClient] = useState<DappConnectType | undefined>(
    propDappConnectClient,
  );
  const walletConnectClient = useRef<SignClient>();
  if (propWalletConnectClient) {
    walletConnectClient.current = propWalletConnectClient;
  }
  const {
    mainKeys,
    registerSignRes,
    afterSignAndLogin,
    getUserAccount,
    login,
    register,
    userAccount,
    setMainKeys,
    loginByQrCode,
    web3MqSignCallback,
    registerByQrCode,
    setUserAccount,
    confirmPassword,
    create,
    connect,
    closeModal,
    onSessionConnected,
    loginByWalletConnect,
    registerByWalletConnect,
  } = useLogin({
    client,
    propWcSession,
    appType,
    account: propsUserAccount,
    keys,
    handleLoginEvent: handleOperationEvent,
    walletConnectClient,
    dappConnectClient,
    isResetPassword,
  });
  const { visible, show, hide } = useToggle(isShow);
  const [step, setStep] = useState(
    userAccount
      ? userAccount.userExist
        ? isResetPassword
          ? StepStringEnum.RESET_PASSWORD
          : StepStringEnum.LOGIN
        : StepStringEnum.SIGN_UP
      : StepStringEnum.HOME,
  );
  const [showLoading, setShowLoading] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>(
    propsUserAccount?.walletType || 'metamask',
  );
  const [errorInfo, setErrorInfo] = useState<string>('');
  const [commonCenterStatusData, setCommonCenterStatusData] = useState<
    CommonCenterStatusIProp | undefined
  >();

  // const handleSuiConnected = async (e: any) => {
  //   if (e && e.account && e.account.address) {
  //     suiWallet.current = e;
  //     getAccount('sui' as WalletType, e.account?.address).then();
  //   }
  // };

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
          setErrorInfo('');
          setConnectLoadingStep(StepStringEnum.HOME);
        },
      });
    } else if (currentStep === StepStringEnum.VIEW_ALL) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.HOME) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.QR_CODE) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.LOGIN) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.SIGN_UP) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.RESET_PASSWORD) {
      setCommonCenterStatusData(undefined);
    } else if (currentStep === StepStringEnum.REJECT_CONNECT) {
      setCommonCenterStatusData({
        styles,
        icon: <ConnectErrorIcon />,
        title: 'Error Reject',
        textContent: 'User rejected methods.',
        showBtn: true,
        btnText: 'Try Again',
        handleBtnClick: () => {
          setErrorInfo('');
          setConnectLoadingStep(StepStringEnum.HOME);
        },
      });
    } else if (
      [StepStringEnum.LOGIN_SIGN_LOADING, StepStringEnum.SIGN_UP_SIGN_LOADING].includes(currentStep)
    ) {
      setCommonCenterStatusData({
        icon: <Loading />,
        title: 'Waiting for signature',
        textContent: 'Confirm the signature in your wallet',
        styles,
      });
    } else if (
      [StepStringEnum.LOGIN_SIGN_ERROR, StepStringEnum.SIGN_UP_SIGN_ERROR].includes(currentStep)
    ) {
      setCommonCenterStatusData({
        styles,
        icon: <ConnectErrorIcon />,
        title: 'Signature error',
        textContent:
          'The signature attempt failed. Click try again and follow the steps to connect to your wallet.',
        showBtn: true,
        btnText: 'Try Again',
        handleBtnClick: () => {
          setErrorInfo('');
          if (userAccount?.userExist) {
            if (isResetPassword) {
              setConnectLoadingStep(StepStringEnum.RESET_PASSWORD);
            } else {
              setConnectLoadingStep(StepStringEnum.LOGIN);
            }
          } else {
            setConnectLoadingStep(StepStringEnum.SIGN_UP);
          }
        },
      });
    }
  };

  const submitLogin = async (password: string) => {
    setShowLoading(true);
    setConnectLoadingStep(StepStringEnum.LOGIN_SIGN_LOADING);
    confirmPassword.current = password;
    try {
      if (dappConnectClient) {
        // 说明是扫码登录
        await loginByQrCode();
      } else if (walletConnectClient.current) {
        await loginByWalletConnect();
      } else {
        await login(walletType);
      }
      setShowLoading(false);
    } catch (e: any) {
      handleOperationEvent({
        msg: e.message,
        data: null,
        type: 'error',
      });
      setErrorInfo(e.message);
      setShowLoading(false);
      setConnectLoadingStep(StepStringEnum.LOGIN_SIGN_ERROR);
    }
  };

  const submitSignUp = async (password: string) => {
    setShowLoading(true);
    setConnectLoadingStep(StepStringEnum.SIGN_UP_SIGN_LOADING);
    confirmPassword.current = password;
    try {
      if (dappConnectClient) {
        await registerByQrCode();
      } else if (walletConnectClient.current) {
        await registerByWalletConnect();
      } else {
        await register(walletType);
      }
      setShowLoading(false);
    } catch (e: any) {
      console.log(e, 'e');
      handleOperationEvent({
        msg: e.message,
        data: null,
        type: 'error',
      });
      setErrorInfo(e.message);
      // wallet Connect when rejected
      if (e.code === -32000 || e.code === -501) {
        setConnectLoadingStep(StepStringEnum.REJECT_CONNECT);
      } else {
        setConnectLoadingStep(StepStringEnum.SIGN_UP_SIGN_ERROR);
      }
      setShowLoading(false);
    }
  };

  useEffect(() => {
    if (!mainKeys) {
      return;
    }
    afterSignAndLogin()
      .then(() => {
        setShowLoading(false);
      })
      .catch((e) => {
        handleOperationEvent({
          msg: e.message,
          data: null,
          type: 'error',
        });
        setMainKeys(undefined);
        setConnectLoadingStep(StepStringEnum.SIGN_UP_SIGN_ERROR);
        setShowLoading(false);
      });
  }, [JSON.stringify(mainKeys), registerSignRes]);

  const getAccount = async (didType?: WalletType, didValue?: string) => {
    setShowLoading(true);
    setConnectLoadingStep(StepStringEnum.CONNECT_LOADING);
    const { address, userExist } = await getUserAccount(didType, didValue);
    if (address) {
      if (userExist) {
        if (isResetPassword) {
          setConnectLoadingStep(StepStringEnum.RESET_PASSWORD);
        } else {
          setConnectLoadingStep(StepStringEnum.LOGIN);
        }
      } else {
        setConnectLoadingStep(StepStringEnum.SIGN_UP);
      }
    } else {
      setConnectLoadingStep(StepStringEnum.CONNECT_ERROR);
    }
    setShowLoading(false);
  };

  const handleWeb3mqCallback = async (eventData: any) => {
    const { method, result } = eventData;
    if (method === WalletMethodMap.providerAuthorization) {
      setWalletType('dappConnect');
      await getAccount('dappConnect', result.address.toLowerCase());
    }
    if (method === WalletMethodMap.personalSign) {
      await web3MqSignCallback(result.signature);
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

  const handleWalletClick = async (type: WalletType) => {
    setWalletType(type as WalletType);
    await getAccount(type as WalletType);
  };

  const handleModalShow = async () => {
    show();
    if (userAccount) {
      if (userAccount.userExist) {
        if (isResetPassword) {
          setConnectLoadingStep(StepStringEnum.RESET_PASSWORD);
        } else {
          setConnectLoadingStep(StepStringEnum.LOGIN);
        }
      } else {
        setConnectLoadingStep(StepStringEnum.SIGN_UP);
      }
    } else {
      setConnectLoadingStep(StepStringEnum.HOME);
    }
  };
  const handleClose = () => {
    hide();
    setShowLoading(false);
    setUserAccount(undefined);
    setConnectLoadingStep(StepStringEnum.HOME);
    setMainKeys(undefined);
    setDappConnectClient(undefined);
  };
  const handleBack = () => {
    setUserAccount(undefined);
    setConnectLoadingStep(StepStringEnum.HOME);
    setMainKeys(undefined);
    setDappConnectClient(undefined);
    setShowLoading(false);
  };
  const headerTitle = useMemo(() => {
    if (
      step === StepStringEnum.HOME ||
      step === StepStringEnum.CONNECT_LOADING ||
      step === StepStringEnum.CONNECT_ERROR
    ) {
      return 'Connect Dapp';
    } else if (
      step === StepStringEnum.LOGIN ||
      step === StepStringEnum.LOGIN_SIGN_LOADING ||
      step === StepStringEnum.LOGIN_SIGN_ERROR
    ) {
      return 'Log in';
    } else if (step === StepStringEnum.QR_CODE) {
      return 'Web3MQ';
    } else if (step === StepStringEnum.REJECT_CONNECT) {
      return 'Wallet Connect';
    } else if (
      step === StepStringEnum.SIGN_UP_SIGN_LOADING ||
      step === StepStringEnum.SIGN_UP_SIGN_ERROR ||
      step === StepStringEnum.SIGN_UP ||
      step === StepStringEnum.RESET_PASSWORD
    ) {
      if (isResetPassword) {
        return 'Reset Password';
      }
      return 'Sign Up';
    } else if (step === StepStringEnum.VIEW_ALL) {
      return 'Choose Desktop wallets';
    } else {
      return 'Connect Dapp';
    }
  }, [step]);
  const RenderWalletAddressBox = useCallback(() => {
    if (!userAccount) return <div></div>;
    return (
      <div className={cx(ss.addressBox)} style={styles?.addressBox}>
        {userAccount.walletType ? (
          userAccount.walletType === 'dappConnect' ? (
            <Web3MqWalletIcon />
          ) : userAccount.walletType === 'braavos' ? (
            <BraavosIcon />
          ) : userAccount.walletType === 'metamask' ? (
            <MetaMaskIcon />
          ) : userAccount.walletType === 'argentX' ? (
            <ArgentXIcon />
          ) : (
            <WalletConnectIcon style={{ height: '21px' }} />
          )
        ) : (
          <MetaMaskIcon />
        )}
        <div className={ss.centerText}>{WalletNameMap[userAccount.walletType] || 'MetaMask'}</div>
        <div className={ss.addressText}>{getShortAddress(userAccount.address || '')}</div>
      </div>
    );
  }, [userAccount]);

  return (
    // <WalletProvider>
    <div className={cx(ss.container)}>
      <div onClick={handleModalShow}>
        {customBtnNode || <Button className={ss.iconBtn}>Login</Button>}
      </div>
      <Modal
        dialogClassName={cx(modalClassName)}
        containerId={containerId}
        appType={appType}
        visible={visible}
        modalHeader={
          <div className={ss.loginModalHead}>
            {!propsUserAccount && step !== StepStringEnum.HOME && (
              <CheveronLeft onClick={handleBack} className={ss.backBtn} />
            )}
            <div className={ss.title}>{headerTitle}</div>
            <CloseBtnIcon onClick={handleClose} className={ss.closeBtn} />
          </div>
        }
        closeModal={handleClose}
      >
        <div className={cx(ss.modalBody)} style={styles?.modalBody}>
          {step === StepStringEnum.HOME && (
            <Home
              // SuiConnectBtn={<ConnectButton />}
              // handleSuiConnect={handleSuiConnected}
              showWeb3MQBtn={showWeb3MQBtn}
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
                    await getAccount('metamask', event.address);
                  }}
                  create={create}
                  connect={connect}
                  closeModal={closeModal}
                  onSessionConnected={onSessionConnected}
                />
              }
            />
          )}
          {step === StepStringEnum.VIEW_ALL && (
            <RenderWallets
              handleViewAll={() => {
                setConnectLoadingStep(StepStringEnum.VIEW_ALL);
              }}
              showLoading={showLoading}
              handleWalletClick={handleWalletClick}
              styles={styles}
            />
          )}
          {step === StepStringEnum.LOGIN && (
            <Login
              showLoading={showLoading}
              errorInfo={errorInfo}
              styles={styles}
              submitLogin={submitLogin}
              addressBox={<RenderWalletAddressBox />}
            />
          )}
          {step === StepStringEnum.SIGN_UP && (
            <SignUp
              showLoading={showLoading}
              errorInfo={errorInfo}
              styles={styles}
              submitSignUp={submitSignUp}
              addressBox={<RenderWalletAddressBox />}
            />
          )}
          {step === StepStringEnum.RESET_PASSWORD && (
            <SignUp
              showLoading={showLoading}
              errorInfo={errorInfo}
              styles={styles}
              submitSignUp={submitSignUp}
              addressBox={<RenderWalletAddressBox />}
              isResetPassword={true}
            />
          )}
          {dappConnectClient && step === StepStringEnum.QR_CODE && (
            <DappConnectModal
              client={dappConnectClient as DappConnect}
              handleSuccess={handleWeb3mqCallback}
              appType={appType}
              handleModalClose={() => {
                setConnectLoadingStep(StepStringEnum.HOME);
              }}
            />
          )}
          {commonCenterStatusData && <CommonCenterStatus {...commonCenterStatusData} />}
        </div>
      </Modal>
    </div>
    //</WalletProvider>
  );
};
