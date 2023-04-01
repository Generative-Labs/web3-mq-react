import React, { useMemo, useRef, useState } from 'react';
import type SignClient from '@walletconnect/sign-client';
import { CheveronLeft, CloseBtnIcon } from '../../icons';
import {
  AppTypeEnum,
  BindDidContextValue,
  BindDidProvider,
  BindStepStringEnum,
  WalletInfoType,
} from '../../context';
import { Button, Modal } from '../../components';
import { Home } from './Home';
import {
  ConnectError,
  ConnectLoading,
  RejectError,
  SignError,
  SignLoading,
  ReadySignUp,
} from './loginLoading';
import useToggle from '../../hooks/useToggle';

import ss from './index.module.scss';
import cx from 'classnames';
import type { WalletType } from '@web3mq/client';
import { Client } from '@web3mq/client';
import { RenderWallets } from './RenderWallets';
import type { DappConnect } from '@web3mq/dapp-connect';
import { WalletMethodMap } from '@web3mq/dapp-connect';
import { DappConnectModal } from '@web3mq/dapp-connect-react';
import useBindDid from './hooks/useBindDid';
import { ReadyBind } from './ReadyBind';
import moment from 'moment';
import { sha3_224 } from 'js-sha3';

type IProps = {
  client?: any;
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
  const [dappConnectClient, setDappConnectClient] = useState<DappConnect>();
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
  } = props;
  const {
    wcSession,
    normalSign,
    create,
    connect,
    closeModal,
    getUserAccount,
    onSessionConnected,
    userAccount,
    web3MqSignCallback,
    setUserAccount,
    sendSignByDappConnect,
    sendSignByWalletConnect,
  } = useBindDid(handleBindDidEvent, client, walletConnectClient, dappConnectClient, appType);
  const { visible, show, hide } = useToggle(isShow);
  const [step, setStep] = useState(BindStepStringEnum.HOME);
  const [showLoading, setShowLoading] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>('eth');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [walletInfo, setWalletInfo] = useState<WalletInfoType>();

  const getAccount = async (didType?: WalletType, didValue?: string) => {
    setShowLoading(true);
    setStep(BindStepStringEnum.CONNECT_LOADING);
    try {
      const { address, userExist } = await getUserAccount(didType, didValue);
      if (address) {
        if (userExist) {
          setStep(BindStepStringEnum.READY_BIND);
        } else {
          setStep(BindStepStringEnum.READY_SIGN_UP);
        }
      } else {
        setStep(BindStepStringEnum.CONNECT_ERROR);
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
        setStep(BindStepStringEnum.READY_BIND);
      } else {
        setStep(BindStepStringEnum.READY_SIGN_UP);
      }
    } else {
      setStep(BindStepStringEnum.HOME);
    }
  };
  const handleClose = () => {
    hide();
    setUserAccount(undefined);
    setStep(BindStepStringEnum.HOME);
    setQrCodeUrl('');
    setDappConnectClient(undefined);
  };

  const handleBack = () => {
    setStep(BindStepStringEnum.HOME);
    setUserAccount(undefined);
    setStep(BindStepStringEnum.HOME);
    setQrCodeUrl('');
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
    if (!userAccount) return;
    const { address, walletType, userid } = userAccount;
    let wallet_type_name = walletType === 'starknet' ? 'Argent' : 'Ethereum'; // or StarkNet another wallet
    const timestamp = Date.now();
    // userid = `user:${sha3_224(did_type + did_value + timestamp)}`;
    const NonceContent = sha3_224(
      userid + address + walletType + 'bind' + didType + didValue + timestamp,
    );
    const signContent = `Web3MQ wants you to sign in with your ${wallet_type_name} account:
${address}
For Web3MQ bind did
URI: ${url}
Version: 1

Nonce: ${NonceContent}
Issued At: ${moment().utc().local().format('DD/MM/YYYY hh:mm')}`;
    if (dappConnectClient) {
      // 说明是扫码登录
      await sendSignByDappConnect(signContent, address);
    } else if (walletConnectClient.current) {
      await sendSignByWalletConnect(signContent, address);
    } else {
      await normalSign(signContent, address, walletType);
    }
  };

  const bindDidContextValue: BindDidContextValue = useMemo(
    () => ({
      walletConnectClient,
      wcSession,
      create,
      connect,
      closeModal,
      onSessionConnected,
      client,
      showLoading,
      step,
      setStep,
      walletType,
      setWalletType,
      handleBindDidEvent,
      setShowLoading,
      styles,
      handleWeb3mqCallback,
      dappConnectClient,
      setDappConnectClient,
      env,
      walletInfo,
      setWalletInfo,
      getAccount,
      qrCodeUrl,
      userAccount,
      sendSign,
      containerId,
      appType,
      setUserAccount
    }),
    [wcSession, step, showLoading, walletType, qrCodeUrl, JSON.stringify(userAccount), env],
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
            {step === BindStepStringEnum.HOME && <Home />}
            {step === BindStepStringEnum.READY_BIND && <ReadyBind />}
            {step === BindStepStringEnum.READY_SIGN_UP && <ReadySignUp />}
            {step === BindStepStringEnum.VIEW_ALL && <RenderWallets />}
            {step === BindStepStringEnum.CONNECT_LOADING && <ConnectLoading />}
            {step === BindStepStringEnum.CONNECT_ERROR && <ConnectError />}
            {step === BindStepStringEnum.SIGN_LOADING && <SignLoading />}
            {step === BindStepStringEnum.SIGN_ERROR && <SignError />}
            {dappConnectClient && (
              <DappConnectModal
                client={dappConnectClient as DappConnect}
                handleSuccess={handleWeb3mqCallback}
                appType={appType}
              />
            )}
            {step === BindStepStringEnum.REJECT_CONNECT && <RejectError />}
          </div>
        </Modal>
      </div>
    </BindDidProvider>
  );
};
