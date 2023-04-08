import React, { useMemo, useRef, useState, useEffect } from 'react';
import type SignClient from '@walletconnect/sign-client';
import { CheveronLeft, CloseBtnIcon, ConnectErrorIcon } from '../../icons';
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
import { CommonCenterStatus } from './loginLoading';
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
import type { SessionTypes } from '@walletconnect/types';
import { WalletConnectButton } from '../WalletConnectButton';
import { Loading } from '../Loading';

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
  propWalletConnectClient?: SignClient;
  propWcSession?: SessionTypes.Struct;
  propDappConnectClient?: DappConnect;
};

export const LoginModal: React.FC<IProps> = (props) => {
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
    propWcSession,
    propWalletConnectClient,
    propDappConnectClient,
  } = props;
  const [dappConnectClient, setDappConnectClient] = useState<DappConnect | undefined>(
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
    propWcSession,
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
  }, [JSON.stringify(mainKeys), registerSignRes]);

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
      step === StepStringEnum.SIGN_UP
    ) {
      return 'Sign up';
    } else if (step === StepStringEnum.VIEW_ALL) {
      return 'Choose Desktop wallets';
    } else {
      return 'Connect Dapp';
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
              {step === StepStringEnum.HOME && (
                <Home
                  WalletConnectBtnNode={
                    <WalletConnectButton
                      handleClientStep={() => {
                        setStep(StepStringEnum.CONNECT_LOADING);
                      }}
                      handleError={() => {
                        setStep(StepStringEnum.REJECT_CONNECT);
                      }}
                      handleConnectEvent={async (event) => {
                        setWalletInfo({
                          name: event.walletName,
                          type: event.walletType,
                        });
                        setWalletType('eth');
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
              {step === StepStringEnum.VIEW_ALL && <RenderWallets />}
              {step === StepStringEnum.LOGIN && <Login />}
              {step === StepStringEnum.SIGN_UP && <SignUp />}
              {step === StepStringEnum.CONNECT_LOADING && (
                <CommonCenterStatus
                  styles={styles}
                  icon={<Loading />}
                  title={'Waiting to connect'}
                  textContent={'Confirm this connection in your wallet'}
                />
              )}
              {step === StepStringEnum.CONNECT_ERROR && (
                <CommonCenterStatus
                  styles={styles}
                  icon={<ConnectErrorIcon />}
                  title={'Error connecting'}
                  textContent={
                    'The connection attempt failed. Please click try again and follow the steps to connect in your wallet.'
                  }
                  showBtn={true}
                  btnText={'Try Again'}
                  handleBtnClick={() => {
                    setStep(StepStringEnum.HOME);
                  }}
                />
              )}
              {[StepStringEnum.LOGIN_SIGN_LOADING, StepStringEnum.SIGN_UP_SIGN_LOADING].includes(
                step,
              ) && (
                <CommonCenterStatus
                  icon={<Loading />}
                  title={'Waiting for signature'}
                  textContent={'Confirm the signature in your wallet'}
                  styles={styles}
                />
              )}
              {[StepStringEnum.LOGIN_SIGN_ERROR, StepStringEnum.SIGN_UP_SIGN_ERROR].includes(
                step,
              ) && (
                <CommonCenterStatus
                  icon={<ConnectErrorIcon />}
                  title={'signature error'}
                  textContent={
                    'The signature attempt failed. Click try again and follow the steps to connect to your wallet.'
                  }
                  styles={styles}
                  btnText={'Try Again'}
                  showBtn={true}
                  handleBtnClick={() => {
                    if (userAccount?.userExist) {
                      setStep(StepStringEnum.LOGIN);
                    } else {
                      setStep(StepStringEnum.SIGN_UP);
                    }
                  }}
                />
              )}
              {dappConnectClient && (
                <DappConnectModal
                  client={dappConnectClient as DappConnect}
                  handleSuccess={handleWeb3mqCallback}
                  appType={appType}
                />
              )}
              {step === StepStringEnum.REJECT_CONNECT && (
                <CommonCenterStatus
                  styles={styles}
                  icon={<ConnectErrorIcon />}
                  title={'Error Reject'}
                  textContent={'User rejected methods.'}
                  showBtn={true}
                  btnText={'Try Again'}
                  handleBtnClick={() => {
                    setStep(StepStringEnum.HOME);
                  }}
                />
              )}
            </div>
          </Modal>
        </div>
      </WalletConnectProvider>
    </LoginProvider>
  );
};
