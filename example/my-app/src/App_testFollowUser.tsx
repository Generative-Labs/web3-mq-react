import React, { useEffect, useState } from 'react';
import { Client, WalletType } from '@web3mq/client';
import { BindDidModal } from '@web3mq/react-components';
import '@web3mq/react-components/dist/css/index.css';

import useLogin from './hooks/useLogin';

type didItemType = {
  did_type: string;
  did_value: string;
  provider_id: string;
  bind_type: string;
  bind_value: string;
  bind_name?: string;
};
type userPublicProfileType = {
  avatar_url: string;
  bind_did_list: didItemType[];
  is_my_following: boolean;
  nickname: string;
  stats: {
    total_followers: number;
    total_following: number;
  };
  timestamp: number;
  userid: string;
  wallet_address: string;
  wallet_type: string;
};

const App: React.FC = () => {
  const { init, fastestUrl } = useLogin();
  const [appType, setAppType] = useState(window.innerWidth <= 600 ? 'h5' : 'pc');
  const address = '0x7236b0F4F1409AFdC7C9fC446943A7b84b6513a1';

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
      <BindDidModal
        url={`${fastestUrl}/api/following/`}
        client={Client}
        appType={appType}
        containerId={''}
        isShow={true}
        env={'dev'}
        handleOperationEvent={handleBindDidEvent}
        operationType={'eth'}
        operationValue={address}
        operationMode={'follow_user'}
        propsUserAccount={{
          userid: 'user:e24ea2e025c6a890147ba2f0070be4c1b311419e69c9d7b04513e488',
          address: '0x074565a74d5913787f342aa8f4db02074d651c79',
          walletType: 'eth',
          userExist: true,
        }}
        props
      />
    </div>
  );
};

export default App;