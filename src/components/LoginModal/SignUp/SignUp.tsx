import React, { useMemo, useState } from 'react';

import { CloseEyesIcon, LoginErrorIcon, OpenEyesIcon } from '../../../icons';
import { Button } from '../../Button';

import ss from './index.module.scss';
import cx from 'classnames';

type IProps = {
  addressBox: React.ReactNode;
  styles: Record<string, any> | null;
  submitSignUp: (password: string) => Promise<void>
  errorInfo: string
  showLoading: boolean
  isResetPassword?: boolean
};
export const SignUp: React.FC<IProps> = (props) => {
  const { addressBox, styles, submitSignUp, errorInfo, showLoading, isResetPassword = false } = props;
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [twoPassword, setTwoPassword] = useState('');

  const isDisable = useMemo(() => {
    let res = !password || !twoPassword || showLoading;
    if (!res) {
      res = password !== twoPassword;
    }
    return res;
  }, [password, twoPassword, showLoading]);

  const handleSubmit = async () => {
    await submitSignUp(password);
  };

  return (
    <div className={cx(ss.container)} style={styles?.loginContainer}>
      {addressBox}
      <div className={ss.textBox}>
        <div className={ss.title} style={styles?.textBoxTitle}>
          { isResetPassword ? 'Reset password' : 'Create password' }
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
          { isResetPassword ? 'Reset password' : 'Create new user' }
        </Button>
      </div>
    </div>
  );
};
