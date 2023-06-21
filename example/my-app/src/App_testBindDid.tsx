import React, { useEffect, useState } from 'react';
import { Client } from '@web3mq/client';
import { BindDidModal } from '@web3mq/react-components';
import '@web3mq/react-components/dist/css/index.css';

import useLogin from './hooks/useLogin';
import { Button } from '@web3mq/dapp-connect-react';

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
    console.log(event, 'event = handleBindDidEvent');
  };

  if (!fastestUrl) {
    return null;
  }
  const styles = {
    // btnBox: {
    //   width: '100%',
    //   marginRight: '16px',
    // },
    modalContainer: {
      width: '50%',
      minWidth: '50%',
      marginRight: '16px',
    },
  };

  return (
    <div
      style={{
        width: '800px',
        display: 'flex',
        alignItems: '40px',
        justifyContent: 'space-between',
      }}
    >
      <BindDidModal
        url={'https://dev-dapp-server.web3mq.com/api/bots/bind_did/'}
        didType={'telegram'}
        didValue={'5818490985'}
        client={Client}
        appType={appType}
        containerId={''}
        isShow={false}
        handleOperationEvent={handleBindDidEvent}
        env={'dev'}
        styles={styles}
        fastestUrl={fastestUrl}
        customBtnNode={<Button style={{
          width: '100%'
        }}>Bind Did </Button>}
      />
      <Button
        style={{
          width: '100%',
        }}
      >
        aaa
      </Button>
    </div>
  );
};

export default App;
