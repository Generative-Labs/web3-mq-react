import React, { FC, useEffect, useMemo } from 'react';

import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { RoomsIcon, ChatsIcon, ProfileIcon } from '../../icons';

import PCBar from './PCBar';
import MobileBar from './MobileBar';
import { ChannelList } from '../ChannelList';
import { ContactList } from '../ContactList';
import { Profile } from '../Profile';
import { Main } from 'components/Main';

export type DashBoardProps = {
  defaultType?: string;
  PCTabMaps?: TabType[],
  MobileTabMaps?: TabType[],
  ChannelHead?: React.ComponentType<any>
};

export type TabType = {
  title: string;
  icon: React.ReactNode;
  type: string;
  component: React.ReactNode;
};

const defaultPCTabMaps: TabType[] = [
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

const defaultMobileTabMaps: TabType[] = [
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
    component: <Profile isTab />,
  },
];

export const DashBoard: FC<DashBoardProps> = (props) => {
  const { defaultType = 'room', MobileTabMaps, PCTabMaps, ChannelHead } = props;
  const { appType, setShowListTypeView } = useChatContext();

  const tabMaps = useMemo(() => {
    return appType !== AppTypeEnum['pc'] ? (MobileTabMaps || defaultMobileTabMaps) : (PCTabMaps || defaultPCTabMaps);
  }, [appType]);

  useEffect(() => {
    setShowListTypeView(defaultType);
  },[]);

  return (
    <>
      {appType !== AppTypeEnum['pc'] ? (
        <MobileBar tabMaps={tabMaps} />
      ) : (
        <PCBar tabMaps={tabMaps} />
      )}
      <Main tabMaps={tabMaps} ChannelHead={ChannelHead} />
    </>
  );
};
