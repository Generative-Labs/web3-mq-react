import React, { useCallback, useState } from 'react';
import type { UserInfo } from 'web2-mq';

import { Avatar } from '../Avatar';
import { SelectArrowIcon, CloseBtnIcon, CheckedIcon } from '../../icons';
import useToggle from '../../hooks/useToggle';
import { useChatContext } from '../../context/ChatContext';

import ss from './index.scss';

interface IProps {
  onChange: (data: UserInfo[]) => void;
}

export const SelectUser: React.FC<IProps> = (props) => {
  const { onChange } = props;
  const { visible, show, toggle } = useToggle();
  const [selectedArr, setSelectedArr] = useState<any>([]);
  const { client } = useChatContext('SelectUser');
  const { contactList } = client.contact;

  const handleCheck = useCallback(
    (item: UserInfo, type: string) => {
      if (type === 'delete') {
        setSelectedArr(() => {
          const newData = selectedArr.filter((el: UserInfo) => el.user_id !== item.user_id);
          onChange && onChange(newData);
          return newData;
        });
      }
      if (type === 'check') {
        setSelectedArr((prevState: UserInfo[]) => {
          const newData = [...prevState, ...[item]];
          onChange && onChange(newData);
          return newData;
        });
      }
    },
    [selectedArr.length],
  );

  const SelectItem = useCallback(
    (item: UserInfo) => (
      <div className={ss.selectItemWarp} key={item.user_id}>
        <Avatar size={20} image={item.avatar} />
        <div className={ss.name}>{item.user_name}</div>
        <CloseBtnIcon style={{ cursor: 'pointer' }} onClick={() => handleCheck(item, 'delete')} />
      </div>
    ),
    [selectedArr.length],
  );

  const CheckBoxItem = useCallback(
    (item: UserInfo) => {
      const isCheck = selectedArr.includes(item);
      return (
        <div
          className={ss.checkBoxItem}
          key={item.user_id}
          onClick={() => handleCheck(item, isCheck ? 'delete' : 'check')}
        >
          {isCheck ? <CheckedIcon /> : <div className={ss.unChecked} />}
          <Avatar image={item.avatar} shape="circle" style={{ marginLeft: 12 }} />
          <div className={ss.name}>{item.user_name}</div>
        </div>
      );
    },
    [selectedArr.length],
  );

  const ShowDownList = useCallback(() => {
    if (!contactList) {
      return null;
    }
    return (
      <div className={ss.showListWarp}>
        <div style={{ display: visible ? 'block' : 'none' }} className={ss.showList}>
          {contactList.map(CheckBoxItem)}
        </div>
      </div>
    );
  }, [visible, CheckBoxItem]);

  return (
    <>
      <div className={ss.selectUserContainer}>
        <div className={ss.wrap}>
          {selectedArr.map(SelectItem)}
          <input className={ss.input} type="text" placeholder="Select users" onFocus={show} />
        </div>
        <SelectArrowIcon
          onClick={toggle}
          className={ss.icon}
          style={{ transform: `rotateZ(${visible ? 180 : 0}deg)` }}
        />
      </div>
      <ShowDownList />
    </>
  );
};
