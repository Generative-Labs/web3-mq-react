import React from 'react';
import cx from 'classnames';
import { useChatContext, ListComponentType } from '../../../context/ChatContext';
import { Avatar } from '../../Avatar';
import { Profile } from '../../Profile';
import type { TabType } from '../DashBoard';

import ss from './index.scss';

type IProps = {
  tabMaps: TabType[];
};

const PCBar: React.FC<IProps> = (props) => {
  const { tabMaps } = props;
  const { setShowListTypeView, showListTypeView, userInfo } = useChatContext();
  return (
    <div className={ss.PcContainer}>
      <Avatar
        className={ss.userAvatar}
        image={userInfo?.web3mqInfo?.avatar_url || userInfo?.defaultUserAvatar}
        name="user"
        size={56}
      />
      <div className={ss.list}>
        {tabMaps.map((tabItem) => {
          return (
            <div
              onClick={() =>
                setShowListTypeView && setShowListTypeView(tabItem.type as ListComponentType)
              }
              key={tabItem.title}
              className={cx(ss.tabItem, { [ss.selected]: showListTypeView === tabItem.type })}
            >
              <div className={cx(ss.icon, { [ss.selected]: showListTypeView === tabItem.type })}>
                {tabItem.icon}
              </div>
              <div className={ss.title}>{tabItem.title}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PCBar;
