import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { Avatar } from '../Avatar';
import { FollowRequestButtonGroup } from '../FollowRequestButtonGroup';
import { Window } from '../Window';
import { AppTypeEnum, useChatContext } from '../../context';
import { dateFormat, getShortAddress } from '../../utils';
import ss from './index.scss';
import { Loading } from '../Loading';
import { RelationEnum, useOperatePermissions } from '../MessageConsole/hooks/useOperatePermissions';

export type NotificationProps = {
  className?: string;
};
export const Notification: React.FC<NotificationProps> = (props) => {
  const { className } = props;
  const {
    activeNotification,
    appType,
    client,
    containerId,
    getUserInfo,
    setActiveNotification,
    setShowListTypeView,
  } = useChatContext('Notification');
  const { targetUserPermissions, toChatTargetUser, getTargetUserPermissions } =
    useOperatePermissions(client);

  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');

  const warnText =
    'Do you want to let XXX message you? They won\'t know you\'ve seen their message until you accept.';

  const init = useCallback(async () => {
    setAvatar('');
    setUsername('');
    if (
      activeNotification &&
      activeNotification.type === 'system.friend_request' &&
      activeNotification.come_from
    ) {
      setLoading(true);
      const come_from = activeNotification.come_from;
      const isuserid = come_from.startsWith('user:');
      if (isuserid) {
        try {
          const userinfo = await getUserInfo(come_from, 'web3mq');
          await getTargetUserPermissions(come_from);
          setLoading(false);
          if (userinfo) {
            setAvatar((userinfo as any).avatar_url || userinfo.defaultUserAvatar);
            setUsername((userinfo as any).nickname || userinfo.defaultUserName);
          }
        } catch (error) {
          setLoading(false);
        }
      }
    }
  }, [activeNotification]);

  useEffect(() => {
    if (activeNotification && activeNotification.come_from && targetUserPermissions) {
      const { follow_status, target_userid, permissions } = targetUserPermissions;
      if (activeNotification.come_from === target_userid) {
        if (toChatTargetUser === RelationEnum.canMessage) {
          onCanMessage();
        }
      }
    }
  }, [activeNotification, targetUserPermissions]);

  const onCanMessage = async () => {
    setActiveNotification(null);
    setShowListTypeView('room');
    await client.channel.setActiveChannel({
      chatid: activeNotification?.come_from || '',
      chat_type: 'user',
      avatar_url: avatar,
      chat_name: username,
    });
  };

  const followCallback = async (isCanMessage?: boolean) => {
    // follow success and can message
    if (activeNotification?.come_from) {
      try {
        await client.channel.updateChannels({
          chatid: activeNotification?.come_from,
          chatType: 'user',
          topic: activeNotification?.come_from,
          topicType: 'user',
        });
        const { channelList } = client.channel;
        let size = 20;
        if (channelList) {
          size = channelList.length + (20 - (channelList.length % 20));
        }
        await client.channel.queryChannels({ page: 1, size: size });
        if (isCanMessage) {
          await onCanMessage();
        }
        await getTargetUserPermissions(activeNotification?.come_from);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const addFriendCallback = () => {
    setActiveNotification(null);
    setShowListTypeView('room');
  };

  useEffect(() => {
    init();
  }, [init]);

  if (
    !activeNotification ||
    activeNotification.type !== 'system.friend_request' ||
    (activeNotification.type === 'system.friend_request' && !activeNotification.come_from)
  ) {
    return null;
  }

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
      {loading ? (
        <div className={ss.loadingBox}>
          <Loading />
        </div>
      ) : (
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
                  <div className={ss.user}>
                    {username || getShortAddress(activeNotification.come_from)}
                  </div>
                  <div className={ss.date}>{dateFormat(activeNotification.timestamp)}</div>
                </div>
                <div className={ss.content}>{activeNotification.content}</div>
              </div>
            </div>
          </div>
          {targetUserPermissions &&
            targetUserPermissions.target_userid === activeNotification.come_from &&
            toChatTargetUser !== RelationEnum.canMessage && (
            <FollowRequestButtonGroup
              client={client}
              toChatTargetUser={toChatTargetUser}
              showFollow={true}
              userId={activeNotification.come_from}
              targetUserPermission={targetUserPermissions}
              warnText={warnText}
              onAddFriendCallback={addFriendCallback}
              onCancel={() => {
                setActiveNotification(null);
              }}
              onFollow={followCallback}
            />
          )}
        </Window>
      )}
    </div>
  );
};
