import React, { useEffect, useState } from 'react';
import { BlockChainMap, Client } from '@web3mq/client';

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
  const cacheData1 = {
    // PRIVATE_KEY: 'bd5ef7c9f2bce5563ceff23d7c86616c3b3c5f78116c7e3338ad979352df8870',
    // PUBLIC_KEY: '63eaf4d2387c1a8a4e0e64f24d41dff58e9655b643b845c7d470278d101c1bf1',
    // MAIN_PUBLIC_KEY: 'ee42ec3d27dcb8f704f782af24da5b5829f3cc2c7cfb9700c941cbe6edf2be81',
    // MESSAGEUPDATEDATE: '1695801519782',
    // PUBKEY_EXPIRED_TIMESTAMP: '1695886370119',
    // W3M_VERSION: '2.3.7',
    // 'gsw-last-1697469593967-1554288037239': 'argentX',
    // MAIN_PRIVATE_KEY:
    //   'iqe7kgRYeAjcUnWPt/hd0ZcQMsrODh379i3U4S4jwD5TFnAaYAiH228uUBfuoKQ4FbZK52D0DEQZxBi3sOo55h6RdffgM6GAHgkxhdr6aCg=',
    // // FAST_URL: 'https://dev-ap-jp-1.web3mq.com',
    // userid: 'user:51024077bf03a1eccdafb2ba1fa96e495854e51ef5891827a5f22db8',
    DID_KEY: 'eth:0xA1Ee15D498Eb2B0020dc51b2Fcc52d457bD2C068',
    WALLET_ADDRESS: '0xA1Ee15D498Eb2B0020dc51b2Fcc52d457bD2C068',
    FAST_URL: 'https://dev-ap-jp-1.web3mq.com',
    MAIN_PRIVATE_KEY:
      'IngXAgltu6XmAQ26u50ZpFbgGij1NbA+TBDtvduMEroaEmohlnAhHUjU0Bxjv0X9fXF6J3/JtDxCACC8E7VGpgTgXvCj4tMYVPtd1EHHZD8=',
    MAIN_PUBLIC_KEY: '01799f31d5b87146b08f8481b76a07c63d162459ed2ad8574a2ec2a6ea0d5821',
    PRIVATE_KEY: '02537f07c3e79d30511e3a640470be31dca7b5de7adbd6279e7801429ad3d4c6',
    PUBLIC_KEY: '12dc263261ea1f15712cfdd5f011f5dbdfffda1424a45516fc318140ea244fe5',
    userid: 'user:d81c20832c8f5a8b50194a4ef2d9a8ce958f7359ad9c5d2559c18069',
  };

  const cacheData = {
    PUBLIC_KEY: '6f13c9c0e0188561d4d8226e92f76e7879605e7231c326aa07e2959d129771e4',
    PRIVATE_KEY: 'df7ba45d35c6d695f6d5d7c87417c299808cead386651c9b16921b98075c6821',
    DID_KEY: 'eth:0x999c97453d339aa45a1fc3a70c79d1b3a3ac582d',
    MAIN_PUBLIC_KEY: '0ea65106383149849cb2969cb93478c7f507475df6c4553e6bafe99584815c4a',
    PUBKEY_EXPIRED_TIMESTAMP: '1701320298029',
    W3M_VERSION: '2.3.7',
    MAIN_PRIVATE_KEY:
      'cS5LUllk56XvVgvqv8hPpwuzR3OrNrllTBTquN3fSbxNQD99znsnGh7Q10xvtRCsKiIvJCLItm5HAX27E71C+T5kpHDfR0CFRlebXWnvEi0=',
    FAST_URL: 'https://dev-ap-jp-1.web3mq.com',
    userid: 'user:388e9930a98d9e5cf02b0718ee3caf40fb3400cc1bdc0aac3599d188',
    WALLET_ADDRESS: '0x999c97453d339aa45a1fc3a70c79d1b3a3ac582d',
  };
  const [web3mqClient, setWeb3mqClient] = useState<any>();

  const [requestGroupID, setRequestGroupID] = useState('');
  const [requestUserid, setRequestUserid] = useState('');
  const [approveGroupID, setApproveGroupID] = useState('');

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
      console.log(web3mqClient.message.messageList, 'aaa');
    }
    if (data.type === 'channel.getList') {
      console.log(web3mqClient.channel.channelList, 'channle list');
    }
    if (data.type === 'notification.received') {
      console.log(data.data, 'data.data');
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
      web3mqClient.on('contact.receiveList', handleEvent);
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
      web3mqClient.on('notification.received', handleEvent);
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
            const ids = res.map((item: any) => item.chatid);
          }}
        >
          queryChannel
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            const res = await web3mqClient?.channel.createRoom({
              groupName: `public Guild${Date.toString()}`,
              permissions: {
                'group:join': {
                  type: 'enum',
                  value: 'public',
                },
              },
            });
            console.log(res);
            // console.log(JSON.stringify(res));
          }}
        >
          create public Room
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            const res = await web3mqClient?.channel.createRoom({
              groupName: `Private Guild${Date.toString()}`,
              permissions: {
                'group:join': {
                  type: 'enum',
                  value: 'validate_by_creator',
                },
              },
            });
            console.log(res);
            // console.log(JSON.stringify(res));
          }}
        >
          create private room
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
            const a = await sha256(
              'user:ea63cbd115dc2a4a2935f6ee669725c11ac2638fa5200ba94d71c84a{"group:join":{"type":"enum","value":"nft_validation"}}[{"chain_id":"1","chain_type":"evm","contract":"0xd29f5f02f5ffcd102faf467f2f236c601830780d"}]',
            );
            const str = ByteArrayToHexString(a);
            console.log(str, 'str');
          }}
        >
          test
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            const guildIds = [
              'group:2f5d85953fec0d92e2da107d0a6d654b7e855235',
              'group:db977bb234c644c27304b7ea7c82e0a0ebf7c6b7',
            ];
            const groupList = await web3mqClient.channel.queryGroups(guildIds, true);
            console.log(groupList, 'groupList');
            console.log(JSON.stringify(groupList));
            // const groups = [];
            // if (groupList && groupList.length) {
            //   for (let i = 0; i < groupList.length; i++) {
            //     let item = groupList[i];
            //     const permission = await web3mqClient.channel.getGroupPermissions(item.groupid);
            //     console.log(permission);
            //     const memberList = await web3mqClient.channel.getGroupMemberList(
            //       {
            //         page: 1,
            //         size: 10,
            //       },
            //       item.groupid,
            //     );
            //     console.log(memberList, 'memberList');
            //     groups.push({
            //       ...item,
            //       ...permission,
            //       memberCount: 10,
            //     });
            //   }
            // }
          }}
        >
          query groups
        </button>
      </div>
      <div>
        <input
          type="text"
          value={requestGroupID}
          onChange={(e) => {
            console.log(e.target.value, 'e.target.value');
            setRequestGroupID(e.target.value);
          }}
        />
      </div>
      <div>
        <button
          onClick={async () => {
            const walletType = 'metamask';
            const { address } = await Client.register.getAccount(walletType);
            const reason = 'test my guild request';
            const res1 = await web3mqClient?.channel.getRequestJoinGroupSignContent({
              groupid: requestGroupID,
              requestReason: reason,
              didType: BlockChainMap[walletType],
              walletAddress: address,
            });
              console.log(res1)
            console.log(JSON.stringify(res1));
            const { requestTime, signContent } = res1;

            const { sign, publicKey } = await Client.register.sign(
              signContent,
              address,
              walletType,
            );
            const res = await web3mqClient?.channel.requestJoinGroupBySignature({
              didPubkey: publicKey,
              signature: sign,
              signContent,
              requestTimestamp: requestTime,
              groupid: requestGroupID,
              requestReason: reason,
              didType: BlockChainMap[walletType],
              walletAddress: address,
            });
            console.log(JSON.stringify(res));
          }}
        >
          request Join Group
        </button>
      </div>
      <div>
        requestUserid:{' '}
        <input
          type="text"
          value={requestUserid}
          onChange={(e) => setRequestUserid(e.target.value)}
        />
      </div>
      <div>
        approveGroupid:{' '}
        <input
          type="text"
          value={approveGroupID}
          onChange={(e) => setApproveGroupID(e.target.value)}
        />
      </div>

      <div>
        <button
          onClick={async () => {
            const walletType = 'metamask';
              const { address } = await Client.register.getAccount(walletType);
              const reason = 'test my guild request';
              const { requestTime, signContent } =
                  await web3mqClient?.channel.getApproveJoinGroupRequestSignContent({
                      groupid: approveGroupID,
                      isApprove: true,
                      didType: BlockChainMap[walletType],
                      walletAddress: address,
                      requestUserid: requestUserid,
                      reason,
                  });

              const { sign, publicKey } = await Client.register.sign(
                  signContent,
                  address,
                  walletType,
              );
              await web3mqClient?.channel.approveJoinGroupRequestBySignature({
                  didPubkey: publicKey,
                  signature: sign,
                  signContent,
                  requestTimestamp: requestTime,
                  groupid: approveGroupID,
                  requestReason: reason,
                  didType: BlockChainMap[walletType],
                  walletAddress: address,
                  requestUserid: requestUserid,
                  isApprove: true,
              });
          }}
        >
          approve request Join Group
        </button>
      </div>
    </div>
  );
};
export default App;
