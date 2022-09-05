import React from 'react';
import cx from 'classnames';

import { useChatContext, ListComponentType } from '../../../context/ChatContext';
import type { TabType } from '../DashBoard';

import ss from './index.scss';

type IProps = {
  tabMaps: TabType[];
};

const MobileBar: React.FC<IProps> = (props) => {
  const { tabMaps } = props;
  const { setShowListTypeView, showListTypeView } = useChatContext();
  return (
    <div className={ss.MobileContainer}>
      {tabMaps.map((tabItem) => {
        return (
          <div
            onClick={() =>
              setShowListTypeView && setShowListTypeView(tabItem.type as ListComponentType)
            }
            key={tabItem.title}
            className={cx(ss.tabItem, { [ss.selected]: showListTypeView === tabItem.type })}
          >
            <div className={ss.icon}>{tabItem.icon}</div>
            <div className={ss.title}>{tabItem.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MobileBar;
