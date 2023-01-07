import React, { useEffect, useState } from 'react';
import { Client } from 'web3-mq';
import {
  Chat,
  Channel,
  DashBoard,
  AppTypeEnum,
  Window,
  MessageHeader,
  MessageList,
  MessageInput,
  LoginModal,
} from 'web3-mq-react';
import 'web3-mq-react/dist/css/index.css';
import MsgInput from './components/MsgInput';

import useLogin from './hooks/useLogin';
import ss from './index.module.scss'


const App: React.FC = () => {
  const { keys, fastestUrl, init, getEthAccount, logout, login, register } = useLogin();

  const [appType, setAppType] = useState(
    window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc'],
  );

  useEffect(() => {
    init();
    document.getElementsByTagName('body')[0].setAttribute('data-theme', 'light');
    window.addEventListener('resize', () => {
      setAppType(window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc']);
    });
  }, []);

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
      color:  '#FFFFFF'
    },
    tipsText: {
      background: 'rgba(255, 255, 255, 0.2)',
      color: '#F4F4F5',
      border: 'none'
    },
    homeButton: {
        border: 'none',
        background: 'rgba(255, 255, 255, 0.2)',
        color: '#F4F4F5',
    },
    loadingBox: {
      background:'#fff'
    }
  };
  if (!keys) {
    return (
      <LoginModal
        appType={AppTypeEnum.pc}
        isShow={true}
        register={register}
        login={login}
        getEthAccount={getEthAccount}
        styles={styles}
        modalClassName={ss.dialogClassName}
      />
    );
  }

  if (!fastestUrl) {
    return null;
  }

  const client = Client.getInstance(keys);

  return (
    <Chat client={client} appType={appType} logout={logout}>
      <DashBoard />
      <Channel>
        <Window>
          <MessageHeader avatarSize={40} />
          <MessageList />
          <MessageInput Input={MsgInput} />
        </Window>
        {/* <Thread />
        <AllThreadList /> */}
      </Channel>
    </Chat>
  );
};

export default App;
