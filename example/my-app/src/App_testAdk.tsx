import React, { useEffect, useState } from 'react';
import { Client } from '@web3mq/client';

const groupId = 'group:3a2d37237eaf7d60326a88b5c7cd25e78e303458'
const App: React.FC = () => {
  const cacheData = {
    DID_KEY: 'eth:0x9b6a5a1dd55ea481f76b782862e7df2977dffe6c',
    FAST_URL: 'https://dev-ap-jp-1.web3mq.com',
    MAIN_PRIVATE_KEY:
      'IX4TVAJv6KC8C1i8v5hOo1jmEnujMe1oS0LpudzZHrpIFDwunHN2Txzb0xkz6BL8LXJ1cCrJszJHDiy/ROxFq6bja5El8Ynx5ilGpHB1+KM=',
    MAIN_PUBLIC_KEY: 'afc38081bbe032c090be0786739ca6cebe58c6a8be4b21c61c03e0c3544c32da',
    PRIVATE_KEY: '2aa135c6c1c45ab77ee419a7e9f8bbe7dc3b51ec2a99215a170c3b916dd3e3b8',
    PUBKEY_EXPIRED_TIMESTAMP: '1695823643283',
    PUBLIC_KEY: '92802b034f5192a162139519347fb2da8574a40475d694d0dffc968f6e8a8bfe',
    WALLET_ADDRESS: '0x9b6a5a1dd55ea481f76b782862e7df2977dffe6c',
    userid: 'user:ea63cbd115dc2a4a2935f6ee669725c11ac2638fa5200ba94d71c84a',
    didType: 'eth',
  };
  const [web3mqClient, setWeb3mqClient] = useState<any>();
    const init = async () => {
    const res = await Client.init({
      didKey: cacheData.DID_KEY,
      app_key: 'vAUJTFXbBZRkEDRE',
      env: 'dev',
      connectUrl: cacheData.FAST_URL,
      tempPubkey: cacheData.PUBLIC_KEY,
    });
    console.log(res, 'res');
    const client = Client.getInstance({
      PrivateKey: cacheData.PRIVATE_KEY,
      PublicKey: cacheData.PUBLIC_KEY,
      userid: cacheData.userid,
    });
    setWeb3mqClient(client);
  };

  const handleEvent = (data: any) => {
    console.log(data, 'data');
  };

  useEffect(() => {
    if (web3mqClient) {
        console.log(123123123)
      // web3mqClient.on('channel.getList', handleEvent);
      web3mqClient.on('message.received', handleEvent);
    }
  }, [web3mqClient]);

    useEffect(() => {
        console.log(web3mqClient?.message.messageList, 'web3mqClient?.message.messageList')
    }, [web3mqClient?.message.messageList]);

  return (
    <div>
      <div>
        <button onClick={init}>init</button>
      </div>
      <div>
        <button
          onClick={async () => {
            const res = await web3mqClient?.channel.queryChannels({
              page: 1,
              size: 10,
            });
            console.log(res);
            console.log(JSON.stringify([res[0]]));
          }}
        >
          queryChannel
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            const res = await web3mqClient?.channel.createRoom({
              groupName: 'testRoom 1',
            });
            console.log(res);
            console.log(JSON.stringify(res));
          }}
        >
          createRoom
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            const res = await web3mqClient?.channel.updateGroupPermissions({
              groupid: groupId,
              permissions: { 'group:join': { type: 'enum', value: 'public' } },
            });
            console.log(res);
            console.log(JSON.stringify(res));
          }}
        >
          update room permission
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            const res = await web3mqClient?.channel.joinGroup(
                groupId,
            );
            console.log(res);
            console.log(JSON.stringify(res));
          }}
        >
          join group
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            const res = await web3mqClient?.message.sendMessage(
              'hello test message',
                groupId
            );
            console.log(res);
              console.log(web3mqClient.message.messageList, 'web3mqClient.message.messageList')
            console.log(JSON.stringify(res));
          }}
        >
          send message
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            const res = await web3mqClient?.message.getMessageList(
                {page: 1, size: 10},
                groupId,
            );
            console.log(res);
            console.log(JSON.stringify(res));
          }}
        >
          get message
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            const res = await web3mqClient?.notify.queryNotifications({
              page: 1,
              size: 10,
            });
            console.log(res);
            console.log(JSON.stringify([res[0]]));
          }}
        >
          queryNotifications
        </button>
      </div>
    </div>
  );
};
export default App;
