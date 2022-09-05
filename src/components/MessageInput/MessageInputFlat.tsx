import React, { useState } from 'react';
import cx from 'classnames';

import { ChatAutoComplete } from '../ChatAutoComplete';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';

import ss from './MessageInputFlat.scss';

export const MessageInputFlat = () => {
  const [showOperat, setShowOperat] = useState<boolean>(false);

  const { appType } = useChatContext('MsgInput');

  return (
    <div
      className={cx(ss.messageInputFlatContainer, {
        [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
      })}
    >
      <div className={ss.inputContainer}>
        <div className={ss.messageIcon} onClick={() => setShowOperat(!showOperat)} />
        <ChatAutoComplete />
      </div>
      <div
        className={cx(ss.opreat, {
          [ss.showOperat]: showOperat,
        })}
      >
        do some think
      </div>
    </div>
  );
};
