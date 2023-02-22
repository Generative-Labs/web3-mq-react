import React, { useMemo, useState } from 'react';

import {
  ArgentXIcon,
  CloseEyesIcon,
  LoginErrorIcon,
  MetaMaskIcon,
  OpenEyesIcon,
} from '../../../icons';
import { StepStringEnum, useLoginContext } from '../../../context';
import { getShortAddress } from '../../../utils';
import { Button } from '../../Button';

import ss from './index.module.scss';
import cx from 'classnames';

export const Login: React.FC = () => {
  const {
    login,
    styles,
    showLoading,
    setShowLoading,
    walletType,
    handleLoginEvent,
    userAccount,
    setStep,
    qrCodeUrl,
    loginByQrCode,
    confirmPassword,
    dappConnectClient,
  } = useLoginContext();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string>();

  const handleSubmit = async () => {
    setShowLoading(true);
    setStep(StepStringEnum.LOGIN_SIGN_LOADING);
    confirmPassword.current = password;
    try {
      if (dappConnectClient.current) {
        // 说明是扫码登录
        await loginByQrCode();
      } else {
        await login(walletType);
      }
      setShowLoading(false);
    } catch (e: any) {
      handleLoginEvent({
        msg: e.message,
        data: null,
        type: 'error',
      });
      setErrorInfo(e.message);
      setShowLoading(false);
      setStep(StepStringEnum.LOGIN_SIGN_ERROR);
    }
  };

  const isDisable = useMemo(() => {
    return showLoading || !password;
  }, [password, showLoading]);
  if (!userAccount) {
    setStep(StepStringEnum.HOME);
    return null;
  }

  return (
    <div className={cx(ss.container)} style={styles?.loginContainer}>
      <div className={cx(ss.addressBox)} style={styles?.addressBox}>
        {userAccount.walletType === 'starknet' ? <ArgentXIcon /> : <MetaMaskIcon />}
        <div className={ss.centerText}>
          {userAccount.walletType === 'starknet' ? 'Argent X' : 'MetaMask'}
        </div>
        <div className={ss.addressText}>{getShortAddress(userAccount.address)}</div>
      </div>
      <div className={ss.textBox}>
        <div className={ss.title} style={styles?.textBoxTitle}>
          Enter password
        </div>
        <div className={ss.subTitle} style={styles?.textBoxSubTitle}>
          Please enter your password associated with the wallet above to access your Web3MQ account.
        </div>
      </div>
      <div className={ss.inputContainer}>
        <div className={ss.inputBox} style={styles?.inputBox}>
          <div className={ss.title}>Password</div>
          <div className={ss.inputValue} style={styles?.inputValue}>
            <input
              style={styles?.inputBoxInput}
              placeholder="Write something..."
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {showPassword ? (
              <div
                className={ss.eyesBox}
                onClick={() => {
                  setShowPassword(false);
                }}
              >
                <OpenEyesIcon />{' '}
              </div>
            ) : (
              <div
                className={ss.eyesBox}
                onClick={() => {
                  setShowPassword(true);
                }}
              >
                <CloseEyesIcon />{' '}
              </div>
            )}
          </div>
        </div>
        {errorInfo && (
          <div className={ss.errorBox}>
            <div className={ss.errorIcon}>
              <LoginErrorIcon />
            </div>
            <div>{errorInfo}</div>
          </div>
        )}
      </div>
      <div className={ss.btnBox}>
        <Button
          style={styles?.loginButton}
          className={ss.button}
          disabled={isDisable}
          type="primary"
          onClick={handleSubmit}
        >
          Log in
        </Button>
      </div>
    </div>
  );
};
