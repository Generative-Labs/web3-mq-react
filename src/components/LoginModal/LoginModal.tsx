import React, { useMemo, useState } from 'react';

import { CheveronLeft, CloseBtnIcon } from '../../icons';
import {
  AppTypeEnum,
  GetEthAccountRes,
  LoginContextValue,
  LoginProvider,
  StepStringEnum,
} from '../../context';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { Login } from './Login';
import { SignUp } from './SignUp';
import { Home } from './Home';
import useToggle from '../../hooks/useToggle';

import ss from './index.module.scss';
import cx from 'classnames';

type IProps = {
  login: (password: string) => Promise<void>;
  register: (password: string) => Promise<void>;
  getEthAccount: () => Promise<GetEthAccountRes>;
  containerId: string;
  isShow?: boolean;
  appType?: AppTypeEnum;
  loginBtnNode?: React.ReactNode;
  account?: {
    address: string;
    userExist: boolean;
  };
  styles?: Record<string, any>;
  modalClassName?: string;
};

export const LoginModal: React.FC<IProps> = (props) => {
  const {
    getEthAccount,
    login,
    register,
    isShow,
    appType = AppTypeEnum.pc,
    containerId,
    loginBtnNode = null,
    account = null,
    styles = null,
    modalClassName = '',
  } = props;
  const { visible, show, hide } = useToggle(isShow);
  const [step, setStep] = useState(account ? StepStringEnum.LOGIN_MODAL : StepStringEnum.HOME);
  const [headerTitle, setHeaderTitle] = useState('Log in');
  const [address, setAddress] = useState(account?.address || '');
  const [userExits, setUserExits] = useState(account?.userExist || false);
  const [showLoading, setShowLoading] = useState(false);

  const getAccount = async () => {
    setShowLoading(true);
    const { address, userExist } = await getEthAccount();
    if (userExist) {
      setHeaderTitle('Log in');
    } else {
      setHeaderTitle('Sign up');
    }
    setAddress(address);
    setUserExits(userExist);
    setStep(StepStringEnum.LOGIN_MODAL);
    setShowLoading(false);
  };

  // 渲染列表列
  const handleModalShow = async () => {
    show();
    setStep(StepStringEnum.HOME);
  };
  const handleClose = () => {
    hide();
  };
  const handleBack = () => {
    setHeaderTitle('Connect Dapp');
    setStep(StepStringEnum.HOME);
  };
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
      getEthAccount: getAccount,
      login,
      address,
      setHeaderTitle,
      step,
      setStep,
      styles: styles,
      showLoading,
      setShowLoading,
    }),

    [address, setAddress, getAccount],
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
            {[StepStringEnum.HOME, StepStringEnum.VIEW_ALL].includes(step) && <Home />}
            {step === StepStringEnum.LOGIN_MODAL ? userExits ? <Login /> : <SignUp /> : null}
          </div>
        </Modal>
      </div>
    </LoginProvider>
  );
};