import React, { useState } from 'react';
import cx from 'classnames';

import { FollowerList } from '../FollowerList';
import { FollowingList } from '../FollowingList';

import ss from './index.scss';

type TabsItem = {
  key: string;
  label: string;
  children: React.ReactNode;
}
export type ContactTabsProps = {
  defaultActiveKey?: string;
  items?: Array<TabsItem>;
};
const Tab: Array<TabsItem> = [
  {
    key: '1',
    label: 'Followers',
    children: <FollowerList />
  },
  {
    key: '2',
    label: 'Following',
    children: <FollowingList />
  }
];
export const ContactTabs: React.FC<ContactTabsProps> = (props) => {
  const { defaultActiveKey = '1', items = Tab } = props;
  const [activeKey, setActiveKey] = useState<string>(defaultActiveKey);

  return (
    <div className={ss.contactTabsContainer}>
      <div className={ss.tabsList}>
        {items.map(item => (
          <div 
            className={cx(ss.tabNav, {
              [ss.selected]: activeKey === item.key
            })} 
            key={item.key}
            onClick={() => setActiveKey(item.key)}
          >
            {item.label}
          </div>
        ))}
      </div>
      {items.map(item => (
        <div
          key={item.key}
          className={cx(ss.tabsContentItem, { [ss.hide]: item.key !== activeKey })}
        >
          {item.children}
        </div>
      ))}
    </div>
  );
};