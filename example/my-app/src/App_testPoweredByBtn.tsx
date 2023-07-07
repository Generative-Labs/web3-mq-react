import React, { useEffect, useState } from 'react';
import { PoweredByWeb3MQ } from '@web3mq/react-components';
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

  if (!fastestUrl) {
    return null;
  }

  return (
    <div>
      <PoweredByWeb3MQ />
    </div>
  );
};

export default App;
