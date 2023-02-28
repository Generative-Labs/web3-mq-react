import React, { useMemo, useState } from 'react';

import {
  ArgentXIcon,
  CloseEyesIcon,
  LoginErrorIcon,
  MetaMaskIcon,
  OpenEyesIcon,
  Web3MqWalletIcon,
  WalletConnectIcon,
} from '../../../icons';
import { getShortAddress } from '../../../utils';
import { Button } from '../../Button';
import { StepStringEnum, useLoginContext, useWalletConnectContext } from '../../../context';

import ss from './index.module.scss';
import cx from 'classnames';

export const SignUp: React.FC = () => {
  const {
    dappConnectClient,
    register,
    styles,
    showLoading,
    setShowLoading,
    walletType,
    handleLoginEvent,
    userAccount,
    setStep,
    walletInfo,
    registerByQrCode,
    confirmPassword,
  } = useLoginContext();
  const { walletConnectClient, registerByWalletConnect } = useWalletConnectContext();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [twoPassword, setTwoPassword] = useState('');
  const [errorInfo, setErrorInfo] = useState<string>();

  const isDisable = useMemo(() => {
    let res = !password || !twoPassword || showLoading;
    if (!res) {
      res = password !== twoPassword;
    }
    return res;
  }, [password, twoPassword, showLoading]);

  const handleSubmit = async () => {
    setShowLoading(true);
    setStep(StepStringEnum.SIGN_UP_SIGN_LOADING);
    try {
      if (password !== twoPassword) {
        setErrorInfo('Passwords don\'t match. Please check your password inputs.');
      }
      confirmPassword.current = password;
      if (dappConnectClient.current) {
        await registerByQrCode();
      } else if (walletConnectClient.current) {
        await registerByWalletConnect();
      } else {
        await register(walletType);
      }

      setShowLoading(false);
    } catch (e: any) {
      handleLoginEvent({
        msg: e.message,
        data: null,
        type: 'error',
      });
      setErrorInfo(e.message);
      // wallet Connect when rejected
      if (e.code === -32000 && e.message === 'User rejected methods.') {
        setStep(StepStringEnum.REJECT_CONNECT);
      } else {
        setStep(StepStringEnum.SIGN_UP_SIGN_ERROR);
      }
      setShowLoading(false);
    }
  };
  if (!userAccount) {
    setStep(StepStringEnum.HOME);
    return null;
  }

  return (
    <div className={cx(ss.container)} style={styles?.loginContainer}>
      <div className={ss.addressBox} style={styles?.addressBox}>
        {walletInfo?.type ? (
          walletInfo.type === 'web3mq' ? (
            <Web3MqWalletIcon />
          ) : walletInfo.type === 'starknet' ? (
            <ArgentXIcon />
          ) : walletInfo.type === 'eth' ? (
            <MetaMaskIcon />
          ) : (
            <WalletConnectIcon style={{height: '21px'}} />
          )
        ) : (
          <MetaMaskIcon />
        )}
        <div className={ss.centerText}>
          {walletInfo?.name || 'MetaMask'}
        </div>
        <div className={ss.addressText}>{getShortAddress(userAccount.address)}</div>
      </div>
      <div className={ss.textBox}>
        <div className={ss.title} style={styles?.textBoxTitle}>
          Create password
        </div>
        <div className={ss.subTitle} style={styles?.textBoxSubTitle}>
          This password will be used to generate encryption keys for communicating with Web3MQ.
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
        <div className={ss.inputBox} style={styles?.inputBox}>
          <div className={ss.title}>Confirm password</div>
          <div className={ss.inputValue} style={styles?.inputValue}>
            <input
              style={styles?.inputBoxInput}
              placeholder="Write something..."
              type={showPassword2 ? 'text' : 'password'}
              onChange={(e) => setTwoPassword(e.target.value)}
              value={twoPassword}
            />
            {showPassword2 ? (
              <div
                className={ss.eyesBox}
                onClick={() => {
                  setShowPassword2(false);
                }}
              >
                <OpenEyesIcon />
              </div>
            ) : (
              <div
                className={ss.eyesBox}
                onClick={() => {
                  setShowPassword2(true);
                }}
              >
                <CloseEyesIcon />
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
        <div className={ss.tipsText} style={styles?.tipsText}>
          <div>The Web3MQ network does not save your password.</div>
          <div>
            Please save it securely. If you lose your password, you will need to reset it, and you
            will be unable to decrypt previous messages.
          </div>
        </div>
      </div>
      <div className={ss.btnBox}>
        <Button
          style={styles?.loginButton}
          className={ss.button}
          disabled={isDisable}
          type="primary"
          onClick={handleSubmit}
        >
          Create new user
        </Button>
      </div>
    </div>
  );
};
