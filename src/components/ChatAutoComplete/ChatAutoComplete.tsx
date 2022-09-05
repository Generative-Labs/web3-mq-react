import React, { PropsWithChildren, useMemo, useCallback } from 'react';
import cx from 'classnames';

import { useMessageInputContext } from '../../context/MessageInputContext';
import { useChannelStateContext } from '../../context/ChannelStateContext';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { useInput } from '../../hooks/useInput';
import { dateTransform } from '../../utils';
import { CloseBtnIcon } from '../../icons/CloseBtn';
import { SendIcon } from '../../icons/SendIcon';

import ss from './index.scss';

export type ChatAutoCompleteProps = {
  rows?: number;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  value?: string;
};

export const ChatAutoComplete = (props: PropsWithChildren<ChatAutoCompleteProps>) => {
  const {
    rows = 1,
    placeholder = 'Send a Message',
    onChange: propOnchange,
    value: propValue = '',
  } = props;

  const { input, setValue } = useInput(propValue);
  const { isThread, sendMessage, closeReply } = useMessageInputContext('ChatAutoComplete');
  const { replyMsgInfo } = useChannelStateContext('ChatAutoComplete');
  const { client, appType } = useChatContext('ChatAutoComplete');

  const onChange = propOnchange || input.onChange;
  const value = propValue || input.value;

  const userName = useMemo(() => {
    const uid = replyMsgInfo?.from_uid;
    return uid ? client.channel.activeMember[uid].user_name : '';
  }, [replyMsgInfo]);

  const handleEvent = useCallback(
    (e: React.KeyboardEvent) => {
      const { key, keyCode, metaKey } = e;
      if (key === 'Enter' && keyCode !== 229 && metaKey) {
        setValue(value + '\n');
        return;
      }
      if (key === 'Enter' && keyCode !== 229) {
        e.preventDefault();
        if (value === '') {
          return;
        }
        sendMessage(value);
        setValue('');
      }
    },
    [value, replyMsgInfo],
  );

  const handleClick = useCallback(() => {
    if (!value) {
      return;
    }
    sendMessage(value);
    setValue('');
  }, [value, replyMsgInfo]);

  return (
    <div className={cx(ss.chatAutoCompleteContainer, { [ss.mobileStyle]: appType !== AppTypeEnum['pc'] })}>
      <div className={ss.replyMessageBox}>
        {replyMsgInfo && !isThread && (
          <div className={ss.replyHistoryMessage}>
            <CloseBtnIcon
              onClick={() => {
                closeReply();
              }}
            />
            <div className={ss.dataInner}>
              <span className={ss.name}>{userName}</span>
              <span className={ss.time}>{dateTransform(replyMsgInfo.created_at)}</span>
            </div>
            <div className={ss.content}>{replyMsgInfo?.msg_contents}</div>
          </div>
        )}
        <textarea
          value={value}
          onChange={onChange}
          className={ss.messageInput}
          rows={rows}
          placeholder={placeholder}
          onKeyDown={handleEvent}
        />
      </div>

      <SendIcon className={ss.sendmessageIcon} onClick={handleClick} />
    </div>
  );
};
