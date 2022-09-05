import React from 'react';
import cx from 'classnames';

import { Avatar as DefaultAvatar } from '../Avatar';
import ss from './index.scss';
import type { UserInfo } from 'web2-mq';

export type ContactPreviewUIComponentProps = {
  Avatar?: React.ComponentType;
  contact?: UserInfo,
  active?: boolean;
  avatarUrl?: string;
  title?: string;
  setActiveContact?: (contact: UserInfo) => void;
};

const UnMemoizedContactPreviewMessenger = (props: ContactPreviewUIComponentProps) => {
  const {
    Avatar = DefaultAvatar,
    active,
    avatarUrl,
    title,
    setActiveContact,
    contact
  } = props;

  const onSetActiveChannel = () => {
    setActiveContact && setActiveContact(contact as UserInfo);
  };

  return (
    <div
      className={cx(ss.channelPreviewContainer, {
        [ss.selected]: active,
      })}
      onClick={onSetActiveChannel}
    >
      <div>
        <Avatar name="user1" image={avatarUrl} size={40} />
      </div>
      <div className={ss.wrapper}>
        {title}
      </div>
    </div>
  );
};

export const ContactPreviewMessenger = React.memo(
  UnMemoizedContactPreviewMessenger,
) as typeof UnMemoizedContactPreviewMessenger;
