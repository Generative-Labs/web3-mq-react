import { useState, useEffect, useCallback } from 'react';
import type { Client, EventTypes, Web3MQDBValue } from '@web3mq/client';

import type {CommonUserInfoType, SearchDidType} from '../../Chat/hooks/useQueryUserInfo';

const PAGE = {
  page: 1,
  size: 20,
};

export const usePaginatedMessages = (props: {
  client: Client;
  loginUserInfo: CommonUserInfoType;
  scrollBottom: () => void;
  getUserInfo: (
    didValue: string,
    didType: SearchDidType,
  ) => Promise<CommonUserInfoType | null>;
}) => {
  const { client, scrollBottom, getUserInfo, loginUserInfo } = props;
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
                message.senderInfo = loginUserInfo;
              }
            }
          });
        } else if (activeChannel.chat_type === 'group') {
          const curMember: any = { ...activeMember };
          for (let message of messageList) {
            if (!message.hasOwnProperty('senderInfo')) {
              const { senderId } = message;
              // check is self message
              if (senderId === client.keys.userid) {
                message.senderInfo = loginUserInfo;
              } else {
                if (!curMember[senderId]) {
                  const info = await getUserInfo(senderId, 'web3mq');
                  message.senderInfo = info;
                  curMember[senderId] = info;
                } else {
                  message.senderInfo = curMember[senderId];
                }
              }
            }
          }
          setActiveMember(curMember);
        }
      }
    },
    [JSON.stringify(loginUserInfo), JSON.stringify(activeMember)],
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
        setMessages(messageList);
        setMsgListloading(false);
        await renderMessageList(messageList);
        setMessages(messageList);
        // 获取message及receive 共同触发message.getList，receive时会传入data参数 简单判断下
        if (data && data.comeFrom) {
          await saveInIndexdb(messageList);
        }
        setTimeout(() => {
          scrollBottom();
        });
      }
      if (type === 'message.send') {
        await renderMessageList(messageList);
        setMessages(messageList);
        setTimeout(() => {
          scrollBottom();
        });
      }
      if (type === 'message.delivered') {
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
    client.on('message.send', handleEvent);
    return () => {
      client.off('message.getList', handleEvent);
      client.off('message.delivered', handleEvent);
      client.off('message.send', handleEvent);
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
