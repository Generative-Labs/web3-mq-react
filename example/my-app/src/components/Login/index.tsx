import React from 'react';
import { MetaMaskIcon } from '../../icons';
import { AppTypeEnum, LoginModal } from 'web3-mq-react';

import './index.css';

interface IProps {
  handleLoginEvent: any;
  mainKeys?: any;
}

const Login: React.FC<IProps> = (props) => {
  const { handleLoginEvent, mainKeys = null } = props;

  const styles = {
    modalBody: {
      background: '#000',
      color: '#E4E4E7',
    },
    homeContainer: {
      color: '#E4E4E7',
    },
    walletItem: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: '#E4E4E7',
    },
    contentBox: {
      color: '#E4E4E7',
    },
    addressBox: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: '#F4F4F5',
      border: 'none',
    },
    textBoxTitle: {
      color: '#E4E4E7',
    },
    textBoxSubTitle: {
      color: '#F4F4F5',
    },
    inputBox: {
      color: '#F4F4F5',
    },
    inputValue: {
      border: '2px solid #3F3F46',
      background: '#000',
      color: '#F4F4F5',
    },
    inputBoxInput: {
      background: '#000',
      color: '#F4F4F5',
    },
    loginButton: {
      background: '#615EF0',
      color: '#FFFFFF',
    },
    tipsText: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: '#F4F4F5',
      border: 'none',
    },
    homeButton: {
      border: 'none',
      background: 'rgba(255, 255, 255, 0.2)',
      color: '#F4F4F5',
    },
    loadingBox: {
      background: '#fff',
    },
  };

  return (
    <div className="login_container">
      <div className="step_box">
        <div className="up_text">Welcome to SwapChat</div>
        <div className="down_text">
          Let’s get started with your decentralized social trading trip now!
        </div>
        <div className="step_text">Step1: Connect Wallet</div>
      </div>
      <div className="button_box">
        <LoginModal
          keys={mainKeys}
          handleLoginEvent={handleLoginEvent}
          appType={AppTypeEnum.pc}
          loginBtnNode={
            <button className="sign_btn">
              <MetaMaskIcon />
              MetaMask
            </button>
          }
        />
      </div>
    </div>
  );
};

export default Login;
