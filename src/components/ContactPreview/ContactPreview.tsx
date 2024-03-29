import React, { useEffect } from 'react';
import { ContactPreviewMessenger } from './ContactPreviewMessenger';
import { formatUserInfoData } from '../../utils';

export type ContactPreviewProps = {
  Preview?: React.ComponentType<ContactPreviewProps>;
  contact: any;
  activeContact: any | null;
  changeActiveContactEvent: (contact: any) => void;
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

  const isActive = activeContact?.userid === contact.userid;
  const { avatar = '', defaultUserAvatar = '', defaultUserName='', nickname, userid } = contact;
  // const { avatar, title } = formatUserInfoData(contact);
  return (
    <Preview
      active={isActive}
      avatarUrl={avatar || defaultUserAvatar}
      title={nickname || defaultUserName || userid}
      setActiveContact={changeActiveContactEvent}
      {...props}
    />
  );
};
