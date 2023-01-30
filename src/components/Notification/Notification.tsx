import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { Avatar } from '../Avatar';
import { FollowRequestButtonGroup } from '../FollowRequestButtonGroup';
import { Window } from '../Window';
import { useChatContext, AppTypeEnum } from '../../context';
import { getShortAddress, dateFormat } from '../../utils';
import ss from './index.scss';

export type NotificationProps = {
  className?: string;
}
export const Notification: React.FC<NotificationProps> = (props) => {
  const { className } = props;
  const { 
    activeNotification, 
    appType, 
    client, 
    containerId,
    getUserInfo,
    setActiveNotification,
  } = useChatContext('Notification');
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const warnText = 'Do you want to let XXX message you? They won\'t know you\'ve seen their message until you accept.';

  const init = useCallback(async () => {
    setAvatar('');
    setUsername('');
    if (activeNotification && activeNotification.type === 'system.friend_request' && activeNotification.come_from) {
      const come_from = activeNotification.come_from;
      const isuserid = come_from.startsWith('user:');
      if (isuserid) {
        try {
          const userinfo = await getUserInfo(come_from, 'web3mq');
          if (userinfo) {
            setAvatar((userinfo as any).avatar_url || userinfo.defaultUserAvatar);
            setUsername((userinfo as any).nickname || userinfo.defaultUserName);
          }
        } catch (error) {
        }
      }
    };
  }, [activeNotification]);

  const followCallback = async() => {
    if (activeNotification?.come_from) {
      try {
        await client.channel.updateChannels({
          chatid: activeNotification?.come_from,
          chat_type: 'user',
          topic: activeNotification?.come_from,
          topic_type: 'user'
        });
        const { channelList } = client.channel;
        let size = 20;
        if (channelList) {
          size = channelList.length + (20 - (channelList.length % 20));
        }
        await client.channel.queryChannels({page: 1, size: size});
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    init();
  }, [init]);

  if (
    !activeNotification || 
    activeNotification.type !== 'system.friend_request' ||
    (activeNotification.type === 'system.friend_request' && !activeNotification.come_from)
  ) return null;

  return (
    <div
      className={cx(
        ss.notificationContainerClass,
        {
          [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
        },
        className,
      )}
    >
      <Window hasContainer={containerId ? true : false}>
        <div className={ss.notificationHeaderContainer}>
          <Avatar size={32} shape="rounded" image={avatar} />
          <div className={ss.title}>{username || activeNotification.come_from}</div>
        </div>
        <div className={ss.notificationBody}>
          <div className={ss.messageLine}>
            <Avatar size={32} shape="rounded" image={avatar} />
            <div className={ss.messageBody}>
              <div className={ss.wrap}>
                <div className={ss.user}>{username || getShortAddress(activeNotification.come_from)}</div>
                <div className={ss.date}>{dateFormat(activeNotification.timestamp)}</div>
              </div>
              <div className={ss.content}>
                {activeNotification.content}
              </div>
            </div>
          </div>
        </div>
        <FollowRequestButtonGroup 
          client={client}
          showBlockBtn={false}
          showFollow={true}
          userId={activeNotification.come_from}
          warnText={warnText}
          onCancel={() => {setActiveNotification(null)}}
          onFollow={followCallback}
        />
      </Window>
    </div>
  );
};