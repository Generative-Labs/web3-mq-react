import { Chat, Channel, Main, DashBoard, AppTypeEnum } from 'web3-mq-react';
import { Client } from 'web2-mq';
import './App.css';
import 'web3-mq-react/dist/css/index.css';
import ChannelInner from './components/ChannelInner';
import Login from './components/Login';
import useLogin from './hooks/useLogin';
import { useEffect, useState } from 'react';

const App = () => {
  const { signMetamask, token, logout } = useLogin();
  const [appType, setAppType] = useState(window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc']);

  useEffect(() => {
    // 保证事件只挂载一次  避免重复render
    window.addEventListener('resize', () => {
      setAppType(window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc']);
    });
  }, []);

  if (!token) {
    return <Login sign={signMetamask} />;
  }

  const client = Client.getInstance(token);

  return (
    <Chat client={client} appType={appType} logout={logout}>
      <DashBoard />
      <Main />
      <Channel>
        <ChannelInner />
      </Channel>
    </Chat>
  );
};

export default App;
