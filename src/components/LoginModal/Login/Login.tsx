import React, { useState } from 'react';

import { CloseEyesIcon, LoginErrorIcon, MetaMaskIcon, OpenEyesIcon } from '../../../icons';
import { useLoginContext } from '../../../context';
import { getShortAddress } from '../../../utils';
import { Button } from '../../Button';

import ss from './index.module.scss';
import cx from 'classnames';

export const Login: React.FC = () => {
  const { login, address, styles } = useLoginContext();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string>();

  const handleSubmit = async () => {
    try {
      await login(password);
    } catch (e: any) {
      setErrorInfo(e.message);
    }
  };

  return (
    <div className={cx(ss.container, styles?.loginContainer)}>
      <div className={cx(ss.addressBox, styles?.addressBox)}>
        <MetaMaskIcon />
        <div className={ss.centerText}>MetaMask</div>
        <div className={ss.addressText}>{getShortAddress(address)}</div>
      </div>
      <div className={ss.textBox}>
        <div className={ss.title}>Enter password</div>
        <div className={ss.subTitle}>
          Please enter your password associated with the wallet above to access your Web3MQ account.
        </div>
      </div>
      <div className={ss.inputContainer}>
        <div className={ss.inputBox}>
          <div className={ss.title}>Password</div>
          <div className={ss.inputValue}>
            <input
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
        <Button className={ss.button} disabled={!password} type="primary" onClick={handleSubmit}>
          Log in
        </Button>
      </div>
    </div>
  );
};
