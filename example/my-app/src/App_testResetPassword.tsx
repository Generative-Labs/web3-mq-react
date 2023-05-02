import React, { useEffect, useState } from 'react';
import { Client } from '@web3mq/client';
import { ResetPasswordModal} from '@web3mq/react-components';
import '@web3mq/react-components/dist/css/index.css';

import useLogin from './hooks/useLogin';

const App: React.FC = () => {
  const { init, fastestUrl } = useLogin();
  const [appType, setAppType] = useState(window.innerWidth <= 600 ? 'h5' : 'pc');
  useEffect(() => {
    init()
    document.body.setAttribute('data-theme', 'light');
    window.addEventListener('resize', () => {
      setAppType(window.innerWidth <= 600 ? 'h5' : 'pc');
    });
  }, []);

  const handleEvent = (event: any) => {
    console.log(event, 'event');
  };

  if (!fastestUrl) {
    return null;
  }

  return (
    <div>
      <ResetPasswordModal
          env={'dev'}
          client={Client}
          handleEvent={handleEvent}
          appType={appType}
      />
    </div>
  );
};

export default App;
