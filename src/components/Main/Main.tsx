import React from 'react';
import cx from 'classnames';
import { ChannelHead as DefaultChannelHead } from '../ChannelHead';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import type { TabType } from '../DashBoard';

import ss from './index.scss';

type IProps = {
  tabMaps: TabType[],
  ChannelHead?: React.ComponentType<any>
};

export const Main: React.FC<IProps> = (props) => {
  const { tabMaps, ChannelHead: propChannelHead } = props;
  const { appType, showListTypeView, containerId } = useChatContext('Main');
  const ChannelHeadUI = propChannelHead || DefaultChannelHead;
  
  return (
    <div
      className={cx(ss.mainContainer, {
        [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
        [ss.hasContainerId]: containerId,
      })}
    >
      <ChannelHeadUI />
      {tabMaps.map(item => (
        <div
          key={item.type}
          className={cx(ss.listItem, { [ss.hide]: item.type !== showListTypeView })}
        >
          {item.component}
        </div>
      ))}
    </div>
  );
};
