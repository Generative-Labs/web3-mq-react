import React, { useEffect, useState } from 'react';
import { Client } from '@web3mq/client';

import { sha256, ByteArrayToHexString } from '@web3mq/client';

const groupId = 'group:3a2d37237eaf7d60326a88b5c7cd25e78e303458';
const App: React.FC = () => {
  // const cacheData = {
  //   DID_KEY: 'eth:0x9b6a5a1dd55ea481f76b782862e7df2977dffe6c',
  //   FAST_URL: 'https://dev-ap-jp-1.web3mq.com',
  //   MAIN_PRIVATE_KEY:
  //     'IX4TVAJv6KC8C1i8v5hOo1jmEnujMe1oS0LpudzZHrpIFDwunHN2Txzb0xkz6BL8LXJ1cCrJszJHDiy/ROxFq6bja5El8Ynx5ilGpHB1+KM=',
  //   MAIN_PUBLIC_KEY: 'afc38081bbe032c090be0786739ca6cebe58c6a8be4b21c61c03e0c3544c32da',
  //   PRIVATE_KEY: '2aa135c6c1c45ab77ee419a7e9f8bbe7dc3b51ec2a99215a170c3b916dd3e3b8',
  //   PUBKEY_EXPIRED_TIMESTAMP: '1695823643283',
  //   PUBLIC_KEY: '92802b034f5192a162139519347fb2da8574a40475d694d0dffc968f6e8a8bfe',
  //   WALLET_ADDRESS: '0x9b6a5a1dd55ea481f76b782862e7df2977dffe6c',
  //   userid: 'user:ea63cbd115dc2a4a2935f6ee669725c11ac2638fa5200ba94d71c84a',
  //   didType: 'eth',
  // };
  const cacheData = {
    DID_KEY: 'eth:0x9b6a5a1dd55ea481f76b782862e7df2977dffe6c',
    PRIVATE_KEY: '5111ec7fda1046fa8a4bfcd8351307068c92f4932b81015d3e32a93efa5fe824',
    PUBLIC_KEY: 'c5f3abee30867c0abf77b77b43258d4892adcec006463f0715be67401296b6fb',
    MAIN_PUBLIC_KEY: 'afc38081bbe032c090be0786739ca6cebe58c6a8be4b21c61c03e0c3544c32da',
    MESSAGEUPDATEDATE: '1695801519782',
    PUBKEY_EXPIRED_TIMESTAMP: '1695886370119',
    W3M_VERSION: '2.3.7',
    'gsw-last-1697469593967-1554288037239': 'argentX',
    MAIN_PRIVATE_KEY:
      'IX4TVAJv6KC8C1i8v5hOo1jmEnujMe1oS0LpudzZHrpIFDwunHN2Txzb0xkz6BL8LXJ1cCrJszJHDiy/ROxFq6bja5El8Ynx5ilGpHB1+KM=',
    FAST_URL: 'https://dev-ap-jp-1.web3mq.com',
    userid: 'user:ea63cbd115dc2a4a2935f6ee669725c11ac2638fa5200ba94d71c84a',
    WALLET_ADDRESS: '0x9b6a5a1dd55ea481f76b782862e7df2977dffe6c',
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
    if (data.type === 'message.getList') {
        console.log(web3mqClient.message.messageList, 'aaa')
    }
  };

  useEffect(() => {
    if (web3mqClient) {
      web3mqClient.on('channel.created', handleEvent);
      web3mqClient.on('channel.getList', handleEvent);
      web3mqClient.on('channel.activeChange', handleEvent);
      web3mqClient.on('channel.updated', handleEvent);
      web3mqClient.on('contact.activeChange', handleEvent);
      web3mqClient.on('contact.getList', handleEvent);
      web3mqClient.on('contact.getContactList', handleEvent);
      web3mqClient.on('contact.getFollowerList', handleEvent);
      web3mqClient.on('contact.getFollowingList', handleEvent);
      web3mqClient.on('contact.friendList', handleEvent);
      web3mqClient.on('contact.reviceList', handleEvent);
      web3mqClient.on('contact.updateList', handleEvent);
      web3mqClient.on('contact.updateContactList', handleEvent);
      web3mqClient.on('contact.updateFollowerList', handleEvent);
      web3mqClient.on('contact.updateFollowingList', handleEvent);
      web3mqClient.on('connect.changeReadyStatus', handleEvent);
      web3mqClient.on('message.send', handleEvent);
      web3mqClient.on('message.delivered', handleEvent);
      web3mqClient.on('message.read', handleEvent);
      web3mqClient.on('message.updated', handleEvent);
      web3mqClient.on('message.getList', handleEvent);
      web3mqClient.on('message.getThreadList', handleEvent);
      web3mqClient.on('message.openAllThread', handleEvent);
      web3mqClient.on('notification.messageNew', handleEvent);
      web3mqClient.on('notification.getList', handleEvent);
      web3mqClient.on('notification.getMyTopicList', handleEvent);
      web3mqClient.on('notification.getMySubscribeList', handleEvent);
    }
  }, [web3mqClient]);

  useEffect(() => {
    console.log(web3mqClient?.message.messageList, 'web3mqClient?.message.messageList');
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
            // console.log(JSON.stringify([res[0]]));
          }}
        >
          queryChannel
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            const res = await web3mqClient?.channel.createRoom({
              groupName: 'test group nft id 222',
              nfts: [
                {
                  chain_id: '1',
                  chain_type: 'evm',
                  contract: '0xd29F5F02f5fFcd102faF467F2F236c601830780d'.toLowerCase(),
                },
              ],
            });
            console.log(res);
            // console.log(JSON.stringify(res));
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
            const res = await web3mqClient?.channel.joinGroup(groupId);
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
            const res = await web3mqClient?.message.sendMessage('hello test message', groupId);
            console.log(res);
            console.log(web3mqClient.message.messageList, 'web3mqClient.message.messageList');
            console.log(JSON.stringify(res));
          }}
        >
          send message
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            const res = await web3mqClient?.message.getMessageList({ page: 1, size: 10 }, groupId);
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
      <div>
        <button
          onClick={async () => {
            const a = await sha256('user:ea63cbd115dc2a4a2935f6ee669725c11ac2638fa5200ba94d71c84a{"group:join":{"type":"enum","value":"nft_validation"}}[{"chain_id":"1","chain_type":"evm","contract":"0xd29f5f02f5ffcd102faf467f2f236c601830780d"}]');
            const str = ByteArrayToHexString(a);
            console.log(str, 'str');
          }}
        >
          test
        </button>
      </div>
    </div>
  );
};
export default App;
