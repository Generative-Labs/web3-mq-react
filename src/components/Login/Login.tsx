import React, { useMemo, useState } from 'react';

import { CheveronLeft, CloseBtnIcon } from '../../icons';
import useToggle from '../../hooks/useToggle';
import { AppTypeEnum, LoginContextValue, LoginProvider, useChatContext } from '../../context';
import { StepOne } from './components/StepOne';
import { StepTwo } from './components/StepTwo';
import { Button } from '../Button';
import { Modal } from '../Modal';

import ss from './index.module.scss';

type IProps = {
  getEthAccount: any;
  login: any;
  register: any;
  isShow?: boolean;
};

export enum StepStringEnum {
  HOME = 'home',
  VIEW_ALL = 'view_all_desktop',
  LOGIN_MODAL = 'login_modal',
}

export const Login: React.FC<IProps> = (props) => {
  const { getEthAccount, login, register, isShow } = props;
  const { visible, show, hide } = useToggle(isShow);
  const [step, setStep] = useState(StepStringEnum.HOME);
  const { appType, containerId } = useChatContext('Login');
  const [headerTitle, setHeaderTitle] = useState('Log in');
  const [address, setAddress] = useState('');
  const [userExits, setUserExits] = useState(false);

  const getAccount = async () => {
    console.log('123123  --  getAccount');
    const { address, userExist } = await getEthAccount();
    if (userExist) {
      setHeaderTitle('Log in');
    } else {
      setHeaderTitle('Sign up');
    }
    setAddress(address);
    setUserExits(userExist);
    setStep(StepStringEnum.LOGIN_MODAL);
  };
  // 渲染列表列
  const handleModalShow = async () => {
    console.log('handleModalShow');
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
        {step !== StepStringEnum.HOME && (
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
      setAddress,
      userExits,
      setUserExits,
      headerTitle,
      setHeaderTitle,
      step,
      setStep,
    }),

    [userExits, setUserExits, address, setAddress, getAccount],
  );

  return (
    <LoginProvider value={loginContextValue}>
      <div className={ss.container}>
        <Button className={ss.iconBtn} onClick={handleModalShow}>
          Login
        </Button>
        <Modal
          appType={AppTypeEnum.pc}
          visible={visible}
          modalHeader={<ModalHead />}
          closeModal={hide}
        >
          <div className={ss.modalBody}>
            {[StepStringEnum.HOME, StepStringEnum.VIEW_ALL].includes(step) && <StepOne />}
            {step === StepStringEnum.LOGIN_MODAL && <StepTwo />}
          </div>
        </Modal>
      </div>
    </LoginProvider>
  );
};
