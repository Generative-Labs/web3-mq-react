import React, { FC, useEffect, useMemo } from 'react';

import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { RoomsIcon, ChatsIcon, NotificationIcon, ProfileIcon } from '../../icons';

import PCBar from './PCBar';
import MobileBar from './MobileBar';
import { ChannelList } from '../ChannelList';
import { ContactTabs } from '../ContactTabs';
import { NotificationList, NotificationModal } from '../NotificationList';
import { Profile } from '../Profile';
import { Main } from '../Main';

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

enum showTypeEnum {
  'list' = 'list',
  'modal' = 'modal'
};
const showNotificationType: showTypeEnum = showTypeEnum['list'];

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
    component: <ContactTabs />,
  },
  {
    title: 'Notification',
    icon: showNotificationType === showTypeEnum['list'] ? <NotificationIcon /> : <NotificationModal /> ,
    type: 'Notification',
    component: <NotificationList style={{width: '360px'}} />,
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
    component: <ContactTabs />,
  },
  {
    title: 'Notification',
    icon: <NotificationIcon />,
    type: 'Notification',
    component: <NotificationList />,
  },
  {
    title: 'Profile',
    icon: <ProfileIcon />,
    type: 'profile',
    component: <Profile isTab hasLogout />,
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
