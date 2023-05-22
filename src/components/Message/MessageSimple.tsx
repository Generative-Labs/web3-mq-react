import React, { useCallback, useState, useRef } from 'react';
import cx from 'classnames';
import { SendMsgLoadingMap } from '@web3mq/client';

import { Avatar } from '../Avatar';
import { Loading } from '../Loading';
import { Profile } from '../Profile';
import { Text } from './Text';

import { useMessageContext } from '../../context/MessageContext';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { ActionBtns } from '../Message/ActionBtns';
import { uselongPressEvents } from '../../hooks/uselongPressEvents';

import ss from './index.scss';
import { SystemNotify } from './SystemNotify';

export const MessageSimple = () => {
  const { isThread, message } = useMessageContext('MessageSimple');
  const { client, appType } = useChatContext('MessageSimple');
  const [isShow, setIsShow] = useState<boolean>(false);
  const {
    date,
    timestamp,
    belong_to_thread_id,
    senderInfo = {},
    msgLoading = SendMsgLoadingMap['success'],
    content = '',
  } = message;
  const { defaultUserAvatar, defaultUserName } = senderInfo || {};
  const messageRef = useRef<HTMLDivElement | null>(null);

  const longPressEvents = uselongPressEvents({
    onStartCallback: () => setIsShow(true),
    onEndCallback: () => setIsShow(false),
    ref: messageRef,
  });

  // 如果是thread中的消息，默认不展示在列表里
  if (!isThread && belong_to_thread_id) {
    return null;
  }


  let messageObj = undefined;
  try {
    messageObj = JSON.parse(content);
  } catch (e) {}

  if (messageObj && messageObj.messageType === 'werewolf_notify' && messageObj.content) {
    return <SystemNotify content={messageObj.content} />;
  }

  const MessageInner = useCallback(() => {
    return <Text />;
    // if (msg_type === MsgTypeEnum.text) {
    //   if (is_opensea_item_thread && isThread) {
    //     return <NftItemCard />;
    //   }
    //   return <SystemNotify />;
    // }
    // if (msg_type === MsgTypeEnum.sudoSwapCard) {
    //   return <SudoSwapCard />;
    // }
    // return <div className={ss.otherMsgType}>暂不支持此消息类型</div>;
  }, []);

  return (
    <div
      className={cx(ss.messageSimpleContainer, {
        [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
        [ss.deviceMobileStyle]: appType === AppTypeEnum['mobile'],
        [ss.deviceMobileShow]: isShow && appType === AppTypeEnum['mobile'],
      })}
      ref={messageRef}
      {...longPressEvents}
    >
      {appType === AppTypeEnum['pc'] ? (
        <Profile
          userInfo={senderInfo}
          isSelf={client.keys.userid === message.senderId}
          AvatarNode={<Avatar name="user" image={defaultUserAvatar} size={40} />}
        />
      ) : (
        <Avatar name="user" image={defaultUserAvatar} size={30} />
      )}

      <div
        className={cx(ss.message, {
          [ss.hideMessageMargin]: isThread,
        })}
      >
        <div className={ss.dataInner}>
          {/* {activeMember[from_uid]?.user_name && (
            <span className={ss.name}>{activeMember[from_uid]?.user_name || ''}</span>
          )} */}
          <span className={ss.name}>{defaultUserName}</span>
          <span>
            {date}&nbsp;{timestamp}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <MessageInner />
          {msgLoading === SendMsgLoadingMap['loading'] && <Loading className={ss.msgLoad} />}
        </div>
      </div>
      {/*{!isThread && <ActionBtns className={ss.actionBtns} />}*/}
    </div>
  );
};
