import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import type { EventTypes } from 'web2-mq';

import { useMessageListElements } from './hooks/useMessageListElements';
import { useMessageLoadMore } from './hooks/useMessageLoadMore';
import { useChannelStateContext } from '../../context/ChannelStateContext';
import { useChatContext } from '../../context/ChatContext';
import type { ComponentContextValue } from '../../context/ComponentContext';
import { Paginator } from '../Paginator';
import { Loading } from '../Loading';

import ss from './index.scss';

export type MessageListProps = {
  Message?: ComponentContextValue['Message'];
  isThread?: boolean;
};

const UnMemoizedMessageList = (props: PropsWithChildren<MessageListProps>) => {
  const { isThread = false } = props;
  const listRef = useRef<HTMLDivElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  let [msgCount, setMsgCount] = useState<number>(0);

  const { messageList, threadList, msgLoading, threadLoading, activeChannel } =
    useChannelStateContext('MessageList');
  const { showLoading, loadMore } = useMessageLoadMore(isThread);
  const { client } = useChatContext('MessageList');
  const list = isThread ? threadList : messageList;
  const loading = isThread ? threadLoading : msgLoading;

  const elements = useMessageListElements({
    ...props,
    Message: props.Message,
    messageList: list,
  });

  const scrollBottom = useCallback((behavior: 'auto' | 'smooth' = 'auto') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const isScreenBottm = useCallback(() => {
    if (listRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = listRef.current;
      const scrollDistance = scrollHeight - (clientHeight + scrollTop);
      return scrollDistance / scrollHeight <= 0.3;
    }
    return true;
  }, []);

  const handleEvent = useCallback(
    (event: { type: EventTypes; data?: any }) => {
      const { type, data } = event;
      if (type === 'message.new') {
        const { from_uid, to } = data;
        const userId = client.user.userInfo.user_id;
        // 判断是否是自己发的
        if (userId === from_uid) {
          scrollBottom('smooth');
          setMsgCount(0);
          return;
        }
        // 新消息是否是当前聊天室的
        if (activeChannel?.room_id === to) {
          // 是否在底部
          if (isScreenBottm()) {
            scrollBottom('smooth');
          } else {
            setMsgCount(++msgCount);
          }
        }
      }
    },
    [activeChannel, msgCount, isScreenBottm],
  );

  // 高度不够时自动拉取下一页，解决thread数据多不能加载的问题
  const autoLoadMoreFromScrollHeight = useCallback(async () => {
    if (listRef.current && !loading && messageList !== null) {
      const { scrollHeight, clientHeight } = listRef.current;
      if (scrollHeight === clientHeight) {
        await loadMore();
        scrollBottom();
      }
    }
  }, [loading, messageList]);

  useEffect(() => {
    if (!loading) {
      scrollBottom();
    }
  }, [loading]);

  useEffect(() => {
    client.on('message.new', handleEvent);
    return () => {
      client.off('message.new', handleEvent);
    };
  }, [msgCount]);

  useEffect(() => {
    autoLoadMoreFromScrollHeight();
  }, [autoLoadMoreFromScrollHeight]);

  const RenderChatDown = useCallback(() => {
    if (msgCount === 0) {
      return null;
    }
    return (
      <div
        className={ss.newMsgCount}
        onClick={() => {
          scrollBottom('smooth');
          setMsgCount(0);
        }}
      >
        {msgCount} new message!
      </div>
    );
  }, [msgCount]);

  if (msgLoading || (isThread && threadLoading)) {
    return (
      <div className={ss.loadingContainer}>
        <Loading />
      </div>
    );
  }

  return (
    <div className={ss.messageListcontainer} ref={listRef}>
      <Paginator reverse element={listRef} showLoading={showLoading} loadNextPage={loadMore}>
        <ul className={ss.chatUl}>{elements}</ul>
      </Paginator>
      <div ref={messagesEndRef} />
      <RenderChatDown />
    </div>
  );
};

export const MessageList = React.memo(UnMemoizedMessageList);
