import React, { useMemo } from 'react';
import cx from 'classnames';
import { ChannelHead } from '../ChannelHead';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { CreateChannel } from '../CreateChannel';
import { PCTabMaps, MobileTabMaps } from '../DashBoard';

import ss from './index.scss';

type IProps = {
  style?: React.CSSProperties;
  className?: string;
};

export const Main: React.FC<IProps> = (props) => {
  const { className, style } = props;
  const { appType, showListTypeView } = useChatContext('Main');

  const tabMaps = useMemo(
    () => (appType !== AppTypeEnum['pc'] ? MobileTabMaps : PCTabMaps),
    [appType],
  );

  return (
    <div
      style={style}
      className={cx(ss.mainContainer, className, {
        [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
      })}
    >
      <ChannelHead />
      {tabMaps.map((item) => (
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
