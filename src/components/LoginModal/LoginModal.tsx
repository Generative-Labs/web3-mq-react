import React, { useMemo, useRef, useState, useEffect } from 'react';
import type SignClient from '@walletconnect/sign-client';
import { CheveronLeft, CloseBtnIcon } from '../../icons';
import {
  AppTypeEnum,
  LoginContextValue,
  LoginProvider,
  StepStringEnum,
  WalletInfoType,
  WalletConnectContextValue,
  WalletConnectProvider,
} from '../../context';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { Home } from './Home';
import { ConnectError, ConnectLoading, SignError, SignLoading, RejectError } from './loginLoading';
import useToggle from '../../hooks/useToggle';

import ss from './index.module.scss';
import cx from 'classnames';
import type { WalletType } from '@web3mq/client';
import { RenderWallets } from './RenderWallets';
import useLogin, { LoginEventDataType, MainKeysType, UserAccountType } from './hooks/useLogin';
import useWalletConnect from './hooks/useWalletConnect';
import { Client } from '@web3mq/client';
import type { DappConnect } from '@web3mq/dapp-connect';
import { WalletMethodMap } from '@web3mq/dapp-connect';
import { DappConnectModal } from '@web3mq/dapp-connect-react';

type IProps = {
  client?: any;
  containerId: string;
  isShow?: boolean;
  appType?: AppTypeEnum;
  loginBtnNode?: React.ReactNode;
  account?: UserAccountType;
  styles?: Record<string, any>;
  modalClassName?: string;
  handleLoginEvent: (eventData: LoginEventDataType) => void;
  keys?: MainKeysType;
  env?: 'dev' | 'test';
};

export const LoginModal: React.FC<IProps> = (props) => {
  const [dappConnectClient, setDappConnectClient] = useState<DappConnect>();
  const walletConnectClient = useRef<SignClient>();
  const {
    isShow,
    client = Client as any,
    appType = window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc'],
    containerId,
    loginBtnNode = null,
    account = undefined,
    styles = null,
    modalClassName = '',
    handleLoginEvent,
    keys = undefined,
    env = 'test',
  } = props;
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
  } = useLogin(handleLoginEvent, client, dappConnectClient, keys, account, appType);
  const {
    wcSession,
    create,
    connect,
    closeModal,
    onSessionConnected,
    registerByWalletConnect,
    loginByWalletConnect,
  } = useWalletConnect({
    confirmPassword,
    client,
    walletConnectClient: walletConnectClient,
    mainKeys,
    userAccount,
    handleLoginEvent,
  });
  const { visible, show, hide } = useToggle(isShow);
  const [step, setStep] = useState(
    userAccount
      ? userAccount.userExist
        ? StepStringEnum.LOGIN
        : StepStringEnum.SIGN_UP
      : StepStringEnum.HOME,
  );
  const [showLoading, setShowLoading] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>(account?.walletType || 'eth');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [walletInfo, setWalletInfo] = useState<WalletInfoType>();

  useEffect(() => {
    if (!mainKeys) {
      return;
    }
    afterSignAndLogin()
      .then(() => {
        setShowLoading(false);
      })
      .catch((e) => {
        handleLoginEvent({
          msg: e.message,
          data: null,
          type: 'error',
        });
        setMainKeys(undefined);
        setStep(StepStringEnum.SIGN_UP_SIGN_ERROR);
        setShowLoading(false);
      });
  }, [mainKeys, registerSignRes]);

  const getAccount = async (didType?: WalletType, didValue?: string) => {
    setShowLoading(true);
    setStep(StepStringEnum.CONNECT_LOADING);
    const { address, userExist } = await getUserAccount(didType, didValue);
    if (address) {
      if (userExist) {
        setStep(StepStringEnum.LOGIN);
      } else {
        setStep(StepStringEnum.SIGN_UP);
      }
    } else {
      setStep(StepStringEnum.CONNECT_ERROR);
    }
    setShowLoading(false);
  };
  const handleWeb3mqCallback = async (eventData: any) => {
    const { method, result } = eventData;
    if (method === WalletMethodMap.providerAuthorization) {
      setWalletType('eth');
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
    if (userAccount) {
      if (userAccount.userExist) {
        setStep(StepStringEnum.LOGIN);
      } else {
        setStep(StepStringEnum.SIGN_UP);
      }
    } else {
      setStep(StepStringEnum.HOME);
    }
  };
  const handleClose = () => {
    hide();
    setUserAccount(undefined);
    setStep(StepStringEnum.HOME);
    setMainKeys(undefined);
    setQrCodeUrl('');
    setDappConnectClient(undefined);
    // dappConnectClient.current = undefined;
  };
  const handleBack = () => {
    setStep(StepStringEnum.HOME);
    setUserAccount(undefined);
    setStep(StepStringEnum.HOME);
    setMainKeys(undefined);
    setQrCodeUrl('');
    setDappConnectClient(undefined);
    setShowLoading(false);
  };
  const headerTitle = useMemo(() => {
    switch (step) {
    case StepStringEnum.HOME:
    case StepStringEnum.CONNECT_LOADING:
    case StepStringEnum.CONNECT_ERROR:
      return 'Connect Dapp';
    case StepStringEnum.LOGIN:
    case StepStringEnum.LOGIN_SIGN_LOADING:
    case StepStringEnum.LOGIN_SIGN_ERROR:
      return 'Log in';
    case StepStringEnum.QR_CODE:
      return 'Web3MQ';
    case StepStringEnum.REJECT_CONNECT:
      return 'Wallet Connect';
    case StepStringEnum.SIGN_UP_SIGN_LOADING:
    case StepStringEnum.SIGN_UP_SIGN_ERROR:
    case StepStringEnum.SIGN_UP:
      return 'Sign up';
    case StepStringEnum.VIEW_ALL:
      return 'Choose Desktop wallets';
    }
  }, [step]);

  const ModalHead = () => {
    return (
      <div className={ss.loginModalHead}>
        {!account && step !== StepStringEnum.HOME && (
          <CheveronLeft onClick={handleBack} className={ss.backBtn} />
        )}
        <div className={ss.title}>{headerTitle}</div>
        <CloseBtnIcon onClick={handleClose} className={ss.closeBtn} />
      </div>
    );
  };

  const loginContextValue: LoginContextValue = useMemo(
    () => ({
      register,
      getAccount,
      login,
      step,
      setStep,
      styles,
      showLoading,
      setShowLoading,
      walletType,
      setWalletType,
      handleLoginEvent,
      handleWeb3mqCallback,
      qrCodeUrl,
      userAccount,
      setMainKeys,
      loginByQrCode,
      registerByQrCode,
      confirmPassword,
      client,
      dappConnectClient,
      env,
      walletInfo,
      setWalletInfo,
      setDappConnectClient,
    }),
    [
      step,
      showLoading,
      walletType,
      qrCodeUrl,
      JSON.stringify(userAccount),
      confirmPassword.current,
      env,
    ],
  );

  const WalletConnectContextValue: WalletConnectContextValue = useMemo(
    () => ({
      walletConnectClient,
      wcSession,
      create,
      connect,
      closeModal,
      onSessionConnected,
      loginByWalletConnect,
      registerByWalletConnect,
    }),
    [wcSession],
  );

  return (
    <LoginProvider value={loginContextValue}>
      <WalletConnectProvider value={WalletConnectContextValue}>
        <div className={cx(ss.container)}>
          <div onClick={handleModalShow}>
            {loginBtnNode || <Button className={ss.iconBtn}>Login</Button>}
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
              {step === StepStringEnum.HOME && <Home />}
              {step === StepStringEnum.VIEW_ALL && <RenderWallets />}
              {step === StepStringEnum.LOGIN && <Login />}
              {step === StepStringEnum.SIGN_UP && <SignUp />}
              {/*{step === StepStringEnum.QR_CODE && <QrCodeLogin />}*/}
              {/*loading*/}
              {step === StepStringEnum.CONNECT_LOADING && <ConnectLoading />}
              {step === StepStringEnum.CONNECT_ERROR && <ConnectError />}
              {[StepStringEnum.LOGIN_SIGN_LOADING, StepStringEnum.SIGN_UP_SIGN_LOADING].includes(
                step,
              ) && <SignLoading />}
              {[StepStringEnum.LOGIN_SIGN_ERROR, StepStringEnum.SIGN_UP_SIGN_ERROR].includes(
                step,
              ) && <SignError />}
              {dappConnectClient && (
                <DappConnectModal
                  client={dappConnectClient as DappConnect}
                  handleSuccess={handleWeb3mqCallback}
                  appType={appType}
                />
              )}
              {step === StepStringEnum.REJECT_CONNECT && <RejectError />}
            </div>
          </Modal>
        </div>
      </WalletConnectProvider>
    </LoginProvider>
  );
};
