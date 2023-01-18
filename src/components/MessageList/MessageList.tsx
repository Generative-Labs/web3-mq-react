import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import type { EventTypes } from 'web3-mq';

import { useMessageListElements } from './hooks/useMessageListElements';
import { usePaginatedMessages } from './hooks/usePaginatedMessages';
import { useChatContext } from '../../context/ChatContext';
import type {CommonUserInfoType} from '../Chat/hooks/useQueryUserInfo';
import type { ComponentContextValue } from '../../context/ComponentContext';
import { Paginator } from '../Paginator';
import { Loading } from '../Loading';

import ss from './index.scss';


export type MessageListProps = {
  Load?: React.ReactNode;
  Message?: ComponentContextValue['Message'];
  isThread?: boolean;
};

const UnMemoizedMessageList = (props: PropsWithChildren<MessageListProps>) => {
  const { isThread = false, Load } = props;
  const listRef = useRef<HTMLDivElement | null>(null);
  // const messagesEndRef = useRef<HTMLDivElement | null>(null);
  // let [msgCount, setMsgCount] = useState<number>(0);

  const scrollBottom = useCallback((behavior: 'auto' | 'smooth' = 'auto') => {
    // messagesEndRef.current?.scrollIntoView({ behavior });
    const el = listRef.current;
    if (el) {
      const { scrollHeight, clientHeight } = el;
      el.style.scrollBehavior = behavior;
      el.scrollTop = scrollHeight - clientHeight;
    };
  }, []);

  const { client, getUserInfo, loginUserInfo } = useChatContext('MessageList');
  
  const { msgListloading, loadMoreLoading, messageList, loadNextPage } = usePaginatedMessages({
    client,
    scrollBottom,
    loginUserInfo: loginUserInfo as CommonUserInfoType,
    getUserInfo
  });

  const elements = useMessageListElements({
    ...props,
    Message: props.Message,
    messageList,
  });

  // const isScreenBottm = useCallback(() => {
  //   if (listRef.current) {
  //     const { scrollHeight, clientHeight, scrollTop } = listRef.current;
  //     const scrollDistance = scrollHeight - (clientHeight + scrollTop);
  //     return scrollDistance / scrollHeight <= 0.3;
  //   }
  //   return true;
  // }, []);

  // const handleEvent = useCallback(
  //   (event: { type: EventTypes; data?: any }) => {
  //     const { type, data } = event;
  // if (type === 'message.new') {
  //   const { from_uid, to } = data;
  //   const userId = client.user.userInfo.user_id;
  //   // 判断是否是自己发的
  //   if (userId === from_uid) {
  //     scrollBottom('smooth');
  //     setMsgCount(0);
  //     return;
  //   }
  //   // 新消息是否是当前聊天室的
  //   if (activeChannel?.room_id === to) {
  //     // 是否在底部
  //     if (isScreenBottm()) {
  //       scrollBottom('smooth');
  //     } else {
  //       setMsgCount(++msgCount);
  //     }
  //   }
  // }
  //   },
  //   [msgCount, isScreenBottm],
  // );

  // 高度不够时自动拉取下一页，解决thread数据多不能加载的问题
  // const autoLoadMoreFromScrollHeight = useCallback(async () => {
  //   if (listRef.current && !loading && messageList !== null) {
  //     const { scrollHeight, clientHeight } = listRef.current;
  //     if (scrollHeight === clientHeight) {
  //       await loadNextPage();
  //       scrollBottom();
  //     }
  //   }
  // }, [loading, messageList]);

  useEffect(() => {
    if (!msgListloading) {
      scrollBottom();
    }
  }, [msgListloading]);
  // const RenderChatDown = useCallback(() => {
  //   if (msgCount === 0) {
  //     return null;
  //   }
  //   return (
  //     <div
  //       className={ss.newMsgCount}
  //       onClick={() => {
  //         scrollBottom('smooth');
  //         setMsgCount(0);
  //       }}
  //     >
  //       {msgCount} new message!
  //     </div>
  //   );
  // }, [msgCount]);

  if (msgListloading) {
    return (
      <div className={ss.loadingContainer}>
        {Load || <Loading />}
      </div>
    );
  }

  return (
    <div className={ss.messageListcontainer} ref={listRef}>
      <Paginator
        reverse
        element={listRef}
        showLoading={loadMoreLoading}
        loadNextPage={loadNextPage}
      >
        <ul className={ss.chatUl}>{elements}</ul>
      </Paginator>
      {/* <div ref={messagesEndRef} /> */}
      {/* <RenderChatDown /> */}
    </div>
  );
};

export const MessageList = React.memo(UnMemoizedMessageList);
