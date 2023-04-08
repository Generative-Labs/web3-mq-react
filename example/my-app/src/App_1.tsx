import React, { useEffect, useState } from 'react';
import { Client } from '@web3mq/client';
import { BindDidModal, AppTypeEnum } from '@web3mq/react-components';
import '@web3mq/react-components/dist/css/index.css';

import useLogin from './hooks/useLogin';

const App: React.FC = () => {
  const { init, fastestUrl } = useLogin();

  const [appType, setAppType] = useState(
    window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc'],
  );

  useEffect(() => {
    init();
    document.body.setAttribute('data-theme', 'light');
    window.addEventListener('resize', () => {
      setAppType(window.innerWidth <= 600 ? AppTypeEnum['h5'] : AppTypeEnum['pc']);
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
      <BindDidModal
        url={'https://dev-dapp-server.web3mq.com/api/bots/bind_did/'}
        didType={'telegram'}
        didValue={'5818490985'}
        client={Client}
        appType={appType}
        containerId={''}
        isShow={true}
        handleBindDidEvent={handleBindDidEvent}
        env={'dev'}
      />
    </div>
  );
};

export default App;
