import React, { useEffect } from 'react';
import { ContactPreviewMessenger } from './ContactPreviewMessenger';
import { formatUserInfoData } from '../../utils';
import type { UserInfo } from 'web2-mq';

export type ContactPreviewProps = {
  Preview?: React.ComponentType<ContactPreviewProps>;
  contact: UserInfo;
  activeContact: UserInfo | null;
  changeActiveContactEvent: (contact: UserInfo) => void;
};
export const ContactPreview = (props: ContactPreviewProps) => {
  const {
    Preview = ContactPreviewMessenger,
    contact,
    activeContact,
    changeActiveContactEvent,
  } = props;

  useEffect(() => {
    //TODO:会从client中监听消息到达事件
    // const client = { on: (_eventName: string, fn: (type: number) => void) => { fn(1)}};
    // client.on('notification.mark_read', count => {
    //   setUnread(count);
    // });
  }, []);

  const isActive = activeContact?.user_id === contact.user_id;
  const { avatar, title } = formatUserInfoData(contact);
  return (
    <Preview
      active={isActive}
      avatarUrl={avatar}
      title={title}
      setActiveContact={changeActiveContactEvent}
      {...props}
    />
  );
};
