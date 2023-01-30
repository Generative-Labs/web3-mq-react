import React, { useEffect, useState } from 'react';
import { Client } from '@web3mq/client';
import {
  Chat,
  ConnectMessage,
  DashBoard,
  AppTypeEnum,
} from 'web3-mq-react';
import 'web3-mq-react/dist/css/index.css';
import Main from './components/Main';
import Login from './components/Login';

import useLogin from './hooks/useLogin';

const App: React.FC = () => {
  const { keys, fastestUrl, init, logout, handleLoginEvent } = useLogin();

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

  if (!keys) {
    let mainKeys = null;
    const mainPrivateKey = localStorage.getItem(`MAIN_PRIVATE_KEY`);
    const mainPublicKey = localStorage.getItem(`MAIN_PUBLIC_KEY`);
    const address = localStorage.getItem('WALLET_ADDRESS');
    if (mainPublicKey && mainPrivateKey && address) {
      mainKeys = {
        publicKey: mainPublicKey,
        privateKey: mainPrivateKey,
        walletAddress: address,
      };
    }
    return <Login handleLoginEvent={handleLoginEvent} mainKeys={mainKeys} />;
  }

  if (!fastestUrl) {
    return null;
  }

  const client = Client.getInstance(keys);

  return (
    <Chat client={client} appType={appType} logout={logout}>
      <ConnectMessage />
      <DashBoard />
      <Main />
      {/* <Channel>
        <Window>
          <MessageHeader avatarSize={40} />
          <MessageList />
          <MessageInput Input={MsgInput} />
          <MessageConsole Input={<MessageInput Input={MsgInput} />} />
        </Window>
        <Thread />
        <AllThreadList />
      </Channel> */}
    </Chat>
  );
};

export default App;
