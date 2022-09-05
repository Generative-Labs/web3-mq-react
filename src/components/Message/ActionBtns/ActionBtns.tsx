import React, { useMemo } from 'react';
import cx from 'classnames';

import { Popover } from '../../Popover';
import { useMessageContext } from '../../../context/MessageContext';
import { ThreadIcon, ReplyIcon } from '../../../icons';
import { useChatContext, AppTypeEnum } from '../../../context/ChatContext';

import ss from './index.scss';

export type ActionBtnItem = {
  key: string;
  com: React.ReactElement;
  msg?: string;
  onClick?: (event: React.BaseSyntheticEvent) => void;
};

export type ActionBtnsProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const ActionBtns = (props: ActionBtnsProps) => {
  const { className, style } = props;

  const { appType } = useChatContext('Message');
  const { isThread, message, handleOpenThread, handleToReply } = useMessageContext('ActionBtns');

  const { is_thread } = message;

  const btns: ActionBtnItem[] = useMemo(() => {
    if (isThread) {
      return [];
    }
    return [
      ...(!is_thread
        ? [
          {
            key: 'thread',
            com: <ThreadIcon />,
            msg: 'Reply in thread',
            onClick: (e: React.BaseSyntheticEvent) => {
              handleOpenThread(message, e);
            },
          },
        ]
        : []),
      {
        key: 'vector',
        com: <ReplyIcon />,
        msg: 'Reply',
        onClick: (e: React.BaseSyntheticEvent) => {
          handleToReply(message, e);
        },
      },
    ];
  }, []);

  return (
    <div
      className={cx(className, ss.actionBtns, {
        [ss.mobileStyle]: appType === AppTypeEnum['mobile'],
      })}
      style={style}
    >
      {btns.map((btn) => {
        const { key, msg, com, onClick = () => {} } = btn;
        if (appType === AppTypeEnum['mobile']) {
          return (
            <div key={key} className={ss.btn} onClick={onClick}>
              <div className={ss.com}>{com}</div>
              <div className={ss.msg}>{msg}</div>
            </div>
          );
        }
        return (
          <Popover key={key} className={ss.btn} content={msg}>
            <div onClick={onClick}>{com}</div>
          </Popover>
        );
      })}
    </div>
  );
};
