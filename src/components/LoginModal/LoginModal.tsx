import React, { useMemo, useState } from 'react';

import { CheveronLeft, CloseBtnIcon } from '../../icons';
import { AppTypeEnum, LoginContextValue, LoginProvider, StepStringEnum } from '../../context';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { QrCodeLogin } from './QrCodeLogin';
import { Home } from './Home';
import useToggle from '../../hooks/useToggle';

import ss from './index.module.scss';
import cx from 'classnames';
import type { WalletType } from 'web3-mq';
import { RenderWallets } from './RenderWallets';
import useLogin, { LoginEventDataType, MainKeysType, UserAccountType } from './hooks/useLogin';

type IProps = {
  containerId: string;
  isShow?: boolean;
  appType?: AppTypeEnum;
  loginBtnNode?: React.ReactNode;
  account?: UserAccountType;
  styles?: Record<string, any>;
  modalClassName?: string;
  handleLoginEvent: (eventData: LoginEventDataType) => void;
  keys?: MainKeysType;
};

export const LoginModal: React.FC<IProps> = (props) => {
  const {
    isShow,
    appType = AppTypeEnum.pc,
    containerId,
    loginBtnNode = null,
    account = undefined,
    styles = null,
    modalClassName = '',
    handleLoginEvent,
    keys = undefined,
  } = props;
  const { getUserAccount, login, register, userAccount, setMainKeys, loginByQrCode } = useLogin(keys, account);
  const { visible, show, hide } = useToggle(isShow);
  const [step, setStep] = useState(
    userAccount
      ? userAccount.userExist
        ? StepStringEnum.LOGIN
        : StepStringEnum.SIGN_UP
      : StepStringEnum.HOME,
  );
  const [showLoading, setShowLoading] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>('eth');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const getAccount = async (didType?: WalletType, didValue?: string) => {
    setShowLoading(true);
    const { address, userExist } = await getUserAccount(didType, didValue);
    if (address) {
      if (userExist) {
        setStep(StepStringEnum.LOGIN);
      } else {
        setStep(StepStringEnum.SIGN_UP);
      }
    }
    setShowLoading(false);
  };
  const handleWeb3mqCallback = async (eventData: any) => {
    console.log(eventData, 'eventData');
    if (eventData.type === 'createQrcode') {
      setQrCodeUrl(eventData.data.qrCodeUrl);
    }
    if (eventData.type === 'keys') {
      const data = eventData.data || null;
      if (data) {
        if (data?.action === 'connectResponse' && data.walletInfo) {
          setWalletType(data.walletInfo.walletType);
          await getAccount(data.walletInfo.walletType, data.walletInfo.address.toLowerCase());
        }
      }
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
  };
  const handleBack = () => {
    setStep(StepStringEnum.HOME);
  };
  const headerTitle = useMemo(() => {
    switch (step) {
    case StepStringEnum.HOME:
      return 'Connect Dapp';
    case StepStringEnum.LOGIN:
      return 'Log in';
    case StepStringEnum.QR_CODE:
      return 'Web3MQ';
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
      styles: styles,
      showLoading,
      setShowLoading,
      walletType,
      setWalletType,
      handleLoginEvent,
      handleWeb3mqCallback,
      qrCodeUrl,
      userAccount,
      setMainKeys,
      loginByQrCode
    }),
    [step, showLoading, walletType, qrCodeUrl, JSON.stringify(userAccount)],
  );

  return (
    <LoginProvider value={loginContextValue}>
      <div className={cx(ss.container)}>
        <div onClick={handleModalShow}>
          {loginBtnNode || <Button className={ss.iconBtn}>Login</Button>}
        </div>
        <Modal
          dialogClassName={modalClassName}
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
            {step === StepStringEnum.QR_CODE && <QrCodeLogin />}
          </div>
        </Modal>
      </div>
    </LoginProvider>
  );
};
