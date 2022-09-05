import React from 'react';

import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { RoomsIcon, ChatsIcon, ProfileIcon } from '../../icons';

import PCBar from './PCBar';
import MobileBar from './MobileBar';
import { ChannelList } from '../ChannelList';
import { ContactList } from '../ContactList';
import { Profile } from '../Profile';

export type TabType = {
  title: string;
  icon: React.ReactNode;
  type: string;
  component: React.ReactNode;
};

export const PCTabMaps: TabType[] = [
  {
    title: 'Rooms',
    icon: <RoomsIcon />,
    type: 'room',
    component: <ChannelList />,
  },
  {
    title: 'Contact',
    icon: <ChatsIcon />,
    type: 'chat',
    component: <ContactList />,
  },
];

export const MobileTabMaps: TabType[] = [
  {
    title: 'Rooms',
    icon: <RoomsIcon />,
    type: 'room',
    component: <ChannelList />,
  },
  {
    title: 'Contact',
    icon: <ChatsIcon />,
    type: 'chat',
    component: <ContactList />,
  },
  {
    title: 'Profile',
    icon: <ProfileIcon />,
    type: 'profile',
    component: (
      <Profile isTab hasLogout userInfo={JSON.parse(localStorage.getItem('USER_INFO') || '{}')} />
    ),
  },
];

export const DashBoard = () => {
  const { appType } = useChatContext();
  if (appType !== AppTypeEnum['pc']) {
    return <MobileBar tabMaps={MobileTabMaps} />;
  }
  return <PCBar tabMaps={PCTabMaps} />;
};
