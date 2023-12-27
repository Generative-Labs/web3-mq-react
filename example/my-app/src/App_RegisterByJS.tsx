import React, { useEffect, useState } from 'react';
import {
  BlockChainMap,
  Client,
  connectWallet,
  signMessage,
  generateMainKeypair,
} from '@web3mq/client';

const App: React.FC = () => {
  const password = '123123';
  const walletType = 'metamask';
  const [fastUrl, setFastUrl] = useState('');

  const init = async () => {
    const res = await Client.init({
      app_key: 'vAUJTFXbBZRkEDRE',
      env: 'dev',
      connectUrl: 'https://dev-ap-jp-1.web3mq.com',
    });
    setFastUrl(res);
  };

  useEffect(() => {
    init();
  }, []);

  const loginFlow = async () => {
    const { address } = await connectWallet(walletType);
    const chain = BlockChainMap[walletType];
    // check user is exist
    const { userid, userExist } = await Client.register.getUserInfo({
      did_value: address,
      did_type: chain,
    });
    const keys = await generateMainKeypair(password, address, walletType);
    const { signContent } = await Client.register.getRegisterSignContent({
      userid,
      mainPublicKey: keys.publicKey,
      didType: chain,
      didValue: address,
    });
    console.log(signContent, 'signContent');
    console.log(JSON.stringify(signContent))
    if (!userExist) {
      // register flow
      const { signContent } = await Client.register.getRegisterSignContent({
        userid,
        mainPublicKey: keys.publicKey,
        didType: chain,
        didValue: address,
      });
      const { sign, publicKey } = await signMessage(signContent, address, walletType);
      const registerRes = await Client.register.register({
        userid,
        didValue: address,
        mainPublicKey: keys.publicKey,
        signature: sign,
        did_pubkey: publicKey,
        didType: chain,
        nickname: 'test register user',
      });
      console.log('registerRes: ', registerRes);
    }

    const res = await Client.register.login({
      mainPrivateKey: keys.secretKey,
      mainPublicKey: keys.publicKey,
      didType: chain,
      didValue: address,
      userid,
      password,
    });
    console.log('loginRes: ', res)
    console.log(JSON.stringify(res))
  };

  return (
    <button onClick={loginFlow} disabled={!fastUrl}>
      {' '}
      {fastUrl ? 'Register && Login' : 'Initializing'}{' '}
    </button>
  );
};
export default App;
