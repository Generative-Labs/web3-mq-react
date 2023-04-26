import React, { useEffect, useState } from 'react';
import { Client } from '@web3mq/client';
import { AuthToReceiveModal } from '@web3mq/react-components';
import '@web3mq/react-components/dist/css/index.css';

import useLogin from './hooks/useLogin';

const App: React.FC = () => {
  const { init, fastestUrl } = useLogin();

  const [appType, setAppType] = useState(window.innerWidth <= 600 ? 'h5' : 'pc');

  useEffect(() => {
    init();
    document.body.setAttribute('data-theme', 'light');
    window.addEventListener('resize', () => {
      setAppType(window.innerWidth <= 600 ? 'h5' : 'pc');
    });
  }, []);

  const handleBindDidEvent = (event: any) => {
    console.log(event, 'event');
  };

  if (!fastestUrl) {
    return null;
  }

  return (
    <div>
      <AuthToReceiveModal
        client={Client}
        url={`${fastestUrl}/api/dapp/user_auth/`}
        appType={appType}
        containerId={''}
        isShow={true}
        env={'dev'}
        handleOperationEvent={handleBindDidEvent}
        dappId={'web3mq:push-server-v1'}
      />
    </div>
  );
};

export default App;
