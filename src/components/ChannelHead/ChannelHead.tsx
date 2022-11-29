import React from 'react';
import cx from 'classnames';

import { NotificationList } from '../NotificationList';
import { CreateChannel } from '../CreateChannel';

import { useChatContext, AppTypeEnum } from '../../context/ChatContext';

import ss from './index.scss';

export const ChannelHead: React.FC = React.memo(() => {
  const { appType, showListTypeView } = useChatContext();

  return (
    <div
      className={cx(ss.channelHeadContainer, { [ss.mobileStyle]: appType !== AppTypeEnum['pc'] })}
    >
      <div className={ss.header}>
        <span className={ss.title}>{showListTypeView !== 'chat' ? 'Chats' : 'Contacts'}</span>
        <NotificationList />
        <CreateChannel />
      </div>
    </div>
  );
});
