import React, { useEffect, useState } from 'react';
import { Client } from '@web3mq/client';
import { Button} from '@web3mq/react-components';
import '@web3mq/react-components/dist/css/index.css';

import useLogin from './hooks/useLogin';
import Login from "./components/Login";
import ss from './index.module.scss'


const App: React.FC = () => {
  const address = '0xd15cb2ff9eb00b3f20f4c2b2caf60c1af4560c56';
  const { keys, fastestUrl, init, logout, handleLoginEvent } = useLogin();
  useEffect(() => {
    document.body.setAttribute('data-theme', 'light');
    init();
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
  

  const getContent = async () => {
    const params = {
      targetDidType: 'eth',
      targetId: address,
      action: 'follow'
    }
    //@ts-ignore
    const { signContent, timestamp } = await client.contact.getFollowOperationSignContent(params)
    const myAddress =  localStorage.getItem('WALLET_ADDRESS');
    if (myAddress) {
      const { sign, publicKey } = await Client.register.sign(signContent, myAddress,'braavos');
      const params2 = {
        didPubkey: publicKey,
        signature: sign,
        signContent,
        followTimestamp: timestamp,
        ...params
      }
      console.log(params2, 'params2')
      //@ts-ignore
      const res = await client.contact.followOperationBySignature(params2)
      console.log(res, 'res')
    }
  }
  
  
  return (
      <>
        <div className={ss.auditBtnsBoxTwo}>
          <Button onClick={getContent}>
            GetSignContent
          </Button>
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
