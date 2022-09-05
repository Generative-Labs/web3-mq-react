import React, { useCallback } from 'react';
import cx from 'classnames';
import { useChannelStateContext } from '../../context/ChannelStateContext';
import { useChannelActionContext } from '../../context/ChannelActionContext';
import { useComponentContext } from '../../context/ComponentContext';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { Loading } from '../Loading';
import { Avatar } from '../Avatar';

import ss from './index.scss';

const UnMemoizedAllThreadList = () => {
  const { client, appType } = useChatContext('MessageSimple');
  const { allThreadList, threadLoading, openAllThread } = useChannelStateContext('AllThreadList');
  const { closeAllThreadList, handleOpenThread } = useChannelActionContext('AllThreadList');
  const { ThreadHeader } = useComponentContext('AllThreadList');
  const { activeMember = {} } = client.channel;

  const handleClose = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      closeAllThreadList();
    }
  }, []);

  if (!openAllThread) {
    return null;
  }

  const RenderList = () => {
    if (threadLoading || !allThreadList) {
      return (
        <div className={ss.loadingContainer}>
          <Loading />
        </div>
      );
    }
    return (
      <div className={ss.warp}>
        {allThreadList.map((item) => {
          return (
            <div
              className={ss.listItem}
              key={item.id}
              onClick={(e) => {
                closeAllThreadList();
                handleOpenThread(item, e);
              }}
            >
              <div className={ss.symbol}>#</div>
              <Avatar className={ss.avatar} image={activeMember[item.from_uid]?.avatar} size={40} />
              <div className={ss.text}>{item.msg_contents}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={ss.mask} onClick={handleClose}>
      <div
        className={cx(ss.allThreadListContainer, {
          [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
        })}
      >
        <ThreadHeader close={closeAllThreadList} title="Thread" appType={appType} />
        <RenderList />
      </div>
    </div>
  );
};

export const AllThreadList = React.memo(UnMemoizedAllThreadList);
