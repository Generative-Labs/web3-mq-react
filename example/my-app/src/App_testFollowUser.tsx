import React, { useEffect, useState } from 'react';
import { Client, getUserPublicProfileRequest } from '@web3mq/client';
import {AppTypeEnum, FollowUserModal, Button} from '@web3mq/react-components';
import '@web3mq/react-components/dist/css/index.css';

import useLogin from './hooks/useLogin';
import Login from "./components/Login";
import ss from './index.module.scss'

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
  const [appType, setAppType] = useState(window.innerWidth <= 600 ? 'h5' : 'pc');
  const address = '0x7236b0F4F1409AFdC7C9fC446943A7b84b6513a1';
  const { keys, fastestUrl, init, logout, handleLoginEvent } = useLogin();


  useEffect(() => {
    init();
    document.body.setAttribute('data-theme', 'light');
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

  const handleBindDidEvent = (event: any) => {
    console.log(event, 'event');
  };

  if (!fastestUrl) {
    return null;
  }


  const client = Client.getInstance(keys);

  return (
      <>
        <div className={ss.auditBtnsBoxTwo}>
          <FollowUserModal
              url={`${fastestUrl}/api/following/`}
              client={Client}
              appType={appType}
              containerId={''}
              env={'dev'}
              propsKeys={keys}
              handleOperationEvent={handleBindDidEvent}
              targetWalletType={'eth'}
              targetWalletAddress={address}
          />
          <Button
              className={ss.shareLinkBtn}
              type={"default"}
          >
            Share Link
          </Button>
        </div>
        <div className={ss.auditBtnsBox}>
          <Button
              className={ss.shareLinkBtn}
              type={"default"}
          >
            Share Link
          </Button>
        </div>
      </>

  );
};

export default App;
