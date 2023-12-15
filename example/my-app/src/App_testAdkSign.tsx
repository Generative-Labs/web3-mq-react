import React, { useEffect, useState } from 'react';
import { BlockChainMap, BlockChainType, Client } from '@web3mq/client';

import { sha256, ByteArrayToHexString } from '@web3mq/client';
import { deflateRaw } from 'zlib';

const groupId = 'group:3a2d37237eaf7d60326a88b5c7cd25e78e303458';
const App: React.FC = () => {

  const init = async () => {
    const res = await Client.init({
      app_key: 'vAUJTFXbBZRkEDRE',
      env: 'dev',
    });
      console.log(res, 'res')
  };

  const connect = async () => {
      const walletType = 'argentX';
      const { address } = await Client.register.getAccount(walletType);
      console.log(address, 'address')
      const signRes = await Client.register.sign('hello', address, 'argentX');
      console.log(signRes, 'signRes')

  }

  return (
    <div>
      <div>
        <button onClick={init}>init</button>
      </div>
      <div>
        <button onClick={connect}>connect</button>
      </div>
      <div>
        <button onClick={init}>sign message </button>
      </div>
    </div>
  );
};
export default App;
