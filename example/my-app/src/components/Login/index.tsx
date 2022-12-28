import React from 'react';
import { MetaMaskIcon } from '../../icons';
import { Button } from 'web3-mq-react';

import './index.css';

interface IProps {
  sign: () => void;
}

const Login: React.FC<IProps> = (props) => {
  const { sign } = props;
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
        <button onClick={sign} className="sign_btn">
          <MetaMaskIcon />
          MetaMask
        </button>
        <Button btnType="primary" size="small">
          Button
        </Button>
      </div>
    </div>
  );
};

export default Login;
