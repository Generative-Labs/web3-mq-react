import { useState, useEffect, useCallback } from 'react';
import type { Client, EventTypes, Web3MQDBValue } from 'web3-mq';

import type { UserInfoType } from '../..//Chat/hooks/useQueryUserInfo';

const PAGE = {
  page: 1,
  size: 20,
};

export const usePaginatedMessages = (props: {
  client: Client;
  userInfo: UserInfoType;
  scrollBottom: () => void;
  getUserInfo: (userid: string) => Promise<UserInfoType>;
}) => {
  const { client, userInfo, scrollBottom, getUserInfo } = props;
  const [messages, setMessages] = useState<any[]>([]);
  const [msgListloading, setMsgListloading] = useState<boolean>(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);
  const [activeMember, setActiveMember] = useState({});
  const getMessageList = useCallback(async (page: number = 1) => {
    PAGE.page = page;
    setMsgListloading(true);
    await client.message.getMessageList(PAGE);
    // setMsgListloading(false);
  }, []);

  const loadNextPage = useCallback(async () => {
    if ((client.message.messageList?.length || 0) < PAGE.size) {
      return;
    }
    PAGE.page++;
    setLoadMoreLoading(true);
    await client.message.getMessageList(PAGE);
    setLoadMoreLoading(false);
  }, []);

  const renderMessageList = useCallback(
    async (messageList: any[]) => {
      const { activeChannel } = client.channel;
      if (activeChannel) {
        // 私聊
        if (activeChannel.chat_type === 'user') {
          const { chatid, homeOwnerInfo } = activeChannel as any;
          messageList.map((message) => {
            if (!message.hasOwnProperty('senderInfo')) {
              if (message.senderId === chatid) {
                message.senderInfo = homeOwnerInfo;
              } else {
                message.senderInfo = userInfo;
              }
            }
          });
        } else if (activeChannel.chat_type === 'group') {
          const curMember: any = { ...activeMember };
          for (let message of messageList) {
            if (!message.hasOwnProperty('senderInfo')) {
              const { senderId } = message;
              // 是否是自己发送消息
              if (senderId === client.keys.userid) {
                console.log('meme');
                message.senderInfo = userInfo;
              } else {
                if (!curMember[senderId]) {
                  console.log('no has');
                  const info = await getUserInfo(senderId);
                  message.senderInfo = info;
                  curMember[senderId] = info;
                } else {
                  console.log('has');
                  message.senderInfo = curMember[senderId];
                }
              }
            }
          }
          setActiveMember(curMember);
        }
      }
    },
    [JSON.stringify(userInfo), JSON.stringify(activeMember)],
  );

  const saveInIndexdb = async (messageList: any) => {
    const { activeChannel } = client.channel;

    if (activeChannel && messageList) {
      const msg = messageList[messageList?.length - 1];
      const data = await client.storage.getData(activeChannel.chatid);
      const msglist = !data ? [msg] : [...data.payload.messageList, msg];
      if (data) {
        const indexeddbData: Web3MQDBValue = {
          ...data,
          payload: {
            messageList: msglist,
          },
        };
        await client.storage.setData(data.from, indexeddbData);
      }
    }
  };

  const handleEvent = useCallback(
    async (props: { type: EventTypes; data: any }) => {
      const { type, data } = props;
      const { messageList } = client.message;
      if (!messageList) {
        return;
      }
      if (type === 'message.getList') {
        await renderMessageList(messageList);
        setMessages(messageList);
        setMsgListloading(false);
        // 获取message及receive 共同触发message.getList，receive时会传入data参数 简单判断下
        if (data && data.comeFrom) {
          await saveInIndexdb(messageList);
        }
        setTimeout(() => {
          scrollBottom();
        });
      }
      if (type === 'message.delivered') {
        await renderMessageList(messageList);
        setMessages(messageList);
        // 存储indexdb
        await saveInIndexdb(messageList);
        setTimeout(() => {
          scrollBottom();
        });
      }
    },
    [renderMessageList],
  );

  useEffect(() => {
    client.on('message.getList', handleEvent);
    client.on('message.delivered', handleEvent);
    return () => {
      client.off('message.getList', handleEvent);
      client.off('message.delivered', handleEvent);
    };
  }, [renderMessageList]);

  useEffect(() => {
    PAGE.page = 1;
    getMessageList();
  }, []);

  return {
    msgListloading,
    loadMoreLoading,
    messageList: messages,
    loadNextPage,
    setMessages,
  };
};
