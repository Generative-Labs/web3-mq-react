import React, { useCallback, useState, useMemo, useRef } from 'react';
import cx from 'classnames';

import { Avatar } from '../Avatar';
import { Profile } from '../Profile';
import { Text } from './Text';
import { SudoSwapCard } from './SudoSwapCard';
import { NftItemCard } from './NftItemCard';
import { dateTransform, getShortAddress } from '../../utils';
import { useMessageContext } from '../../context/MessageContext';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { ActionBtns } from '../Message/ActionBtns';
import { uselongPressEvents } from '../../hooks/uselongPressEvents';

import ss from './index.scss';

export const MessageSimple = () => {
  const { isThread, message } = useMessageContext('MessageSimple');
  const { client, appType } = useChatContext('MessageSimple');
  const [isShow, setIsShow] = useState<boolean>(false);
  const { created_at, from_uid, msg_type, belong_to_thread_id, is_opensea_item_thread } = message;
  const { activeMember = {} } = client.channel as any;
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

  const MessageInner = useCallback(() => {
    return <Text />;
    // if (msg_type === MsgTypeEnum.text) {
    //   if (is_opensea_item_thread && isThread) {
    //     return <NftItemCard />;
    //   }
    //   return <Text />;
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
      <Profile
        userInfo={activeMember[from_uid] || {}}
        AvatarNode={
          <Avatar
            name="user"
            image={activeMember[from_uid]?.avatar || ''}
            size={appType !== AppTypeEnum['pc'] ? 30 : 40}
          />
        }
      />
      <div
        className={cx(ss.message, {
          [ss.hideMessageMargin]: isThread,
        })}
      >
        <div className={ss.dataInner}>
          {/* {activeMember[from_uid]?.user_name && (
            <span className={ss.name}>{activeMember[from_uid]?.user_name || ''}</span>
          )} */}
          <span className={ss.name}>{activeMember[from_uid]?.user_name || getShortAddress(message.senderId)}</span>
          <span>{message.date}&nbsp;{message.timestamp}</span>
        </div>
        <MessageInner />
      </div>
      {!isThread && <ActionBtns className={ss.actionBtns} />}
    </div>
  );
};
