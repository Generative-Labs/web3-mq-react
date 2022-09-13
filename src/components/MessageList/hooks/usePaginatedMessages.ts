import { useState, useEffect, useCallback } from 'react';
import type { Client, EventTypes } from 'web3-mq';

const PAGE = {
  page: 1,
  size: 20,
};

export const usePaginatedMessages = (client: Client, scrollBottom: () => void) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [msgListloading, setMsgListloading] = useState<boolean>(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);

  const getMessageList = useCallback(async (page: number = 1) => {
    PAGE.page = page;
    setMsgListloading(true);
    await client.message.getMessageList(PAGE);
    setMsgListloading(false);
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

  const handleEvent = useCallback(
    (props: { type: EventTypes }) => {
      const { type } = props;
      const { messageList, msg_text } = client.message;
      if (!messageList) {
        return;
      }
      if (type === 'message.getList') {
        setMessages(messageList);
      }
      if (type === 'message.delivered') {
        const list = messages || [];
        setMessages([...list, { content: msg_text, id: list.length + 1 }]);
        setTimeout(() => {
          scrollBottom();
        });
      }
    },
    [messages],
  );

  useEffect(() => {
    client.on('message.getList', handleEvent);
    client.on('message.delivered', handleEvent);
    return () => {
      client.off('message.getList', handleEvent);
      client.off('message.delivered', handleEvent);
    };
  }, [messages.length]);

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
