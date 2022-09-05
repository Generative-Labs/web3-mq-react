import React, { useCallback } from 'react';
import { Loading } from '../../Loading';
import { useMessageContext } from '../../../context/MessageContext';

import ss from './index.scss';

export const Text: React.FC = () => {
  const { isThread, message, handleOpenThread } = useMessageContext('MessageInnerText');
  const { is_thread, msg_contents, reply_to_msg_id } = message;

  const renderReplyMessage = useCallback(
    () => (
      <div>
        {message.reply_msg_info ? (
          <div
            className={ss.replyMessage}
            onClick={(e) => {
              handleOpenThread(message, e);
            }}
          >
            {message.reply_msg_info.user_name}: {message.reply_msg_info.msg_contents}
          </div>
        ) : (
          <Loading className={ss.loading} />
        )}
      </div>
    ),
    [],
  );

  const renderThreadMessage = useCallback(
    (_isReply) => (
      <div
        className={ss.threadMessage}
        onClick={(e) => {
          handleOpenThread(message, e);
        }}
        style={{ marginTop: _isReply ? '10px' : '0' }}
      >
        More message
      </div>
    ),
    [],
  );

  // 渲染Thread展示盒子
  const ExtraBox = useCallback(() => {
    const _isReply = reply_to_msg_id;
    const _isThread = is_thread && !isThread;

    if (_isReply || _isThread) {
      return (
        <div className={ss.extraBox}>
          <div className={ss.extraFlag} style={{ marginTop: _isReply && _isThread ? '-24px' : '' }}>
            ↵
          </div>
          <div className={ss.extraMain}>
            {_isReply && renderReplyMessage()}
            {_isThread && renderThreadMessage(_isReply)}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }, []);

  return (
    <div className={ss.textContainer}>
      <div className={ss.textInner}>
        <div className={ss.text}>{msg_contents}</div>
      </div>
      <ExtraBox />
    </div>
  );
};
