import React from 'react';
import cx from 'classnames';

import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { CreateChannelIcon } from '../../icons/CreateChannelIcon';

import ss from './index.scss';
import { NotificationList } from '../NotificationList';

export const ChannelHead: React.FC = React.memo(() => {
  const { client, appType, showCreateChannel, setShowCreateChannel } = useChatContext();

  return (
    <div
      className={cx(ss.channelHeadContainer, { [ss.mobileStyle]: appType !== AppTypeEnum['pc'] })}
    >
      <div className={ss.header}>
        <span className={ss.title}>Chats</span>
        <NotificationList />
        <button
          className={ss.btn}
          onClick={() => {
            setShowCreateChannel(!showCreateChannel);
          }}
        >
          <CreateChannelIcon />
        </button>
      </div>
    </div>
  );
});
