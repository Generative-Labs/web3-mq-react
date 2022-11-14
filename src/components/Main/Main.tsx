import React from 'react';
import cx from 'classnames';
import { ChannelHead } from '../ChannelHead';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { CreateChannel } from '../CreateChannel';
import type { TabType } from '../DashBoard';

import ss from './index.scss';

type IProps = {
  tabMaps: TabType[]
};

export const Main: React.FC<IProps> = (props) => {
  const { tabMaps } = props;
  const { appType, showListTypeView, containerId } = useChatContext('Main');

  return (
    <div
      className={cx(ss.mainContainer, {
        [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
        [ss.hasContainerId]: containerId,
      })}
    >
      <ChannelHead />
      {tabMaps.map(item => (
        <div
          key={item.type}
          className={cx(ss.listItem, { [ss.hide]: item.type !== showListTypeView })}
        >
          {item.component}
        </div>
      ))}
      <CreateChannel />
    </div>
  );
};
