import React, { useCallback, useState, useRef } from 'react';

import { Avatar } from '../Avatar';
import { SelectArrowIcon, CloseBtnIcon, CheckedIcon } from '../../icons';
import useToggle from '../../hooks/useToggle';
import { useChatContext } from '../../context/ChatContext';
import { usePaginatedTopics } from './hooks/usePaginatedTopics';
import ss from './index.scss';

interface IProps {
  onChange: (data: any[]) => void;
}

export const SelectTopic: React.FC<IProps> = (props) => {
  const { onChange } = props;
  const { visible, show, toggle } = useToggle();
  const [selectedArr, setSelectedArr] = useState<any>([]);
  const { client } = useChatContext('SelectUser');
  const {
    status,
    createTopicList,
    refreshing,
    loadNextPage,
  } = usePaginatedTopics(client);

  const handleCheck = useCallback(
    (item: any, type: string) => {
      if (type === 'delete') {
        setSelectedArr(() => {
          const newData = selectedArr.filter((el: any) => el.topicid !== item.topicid);
          onChange && onChange(newData);
          return newData;
        });
      }
      if (type === 'check') {
        setSelectedArr((prevState: any[]) => {
          const newData = [...prevState, ...[item]];
          onChange && onChange(newData);
          return newData;
        });
      }
    },
    [selectedArr.length],
  );

  const SelectItem = useCallback(
    (item: any) => (
      <div className={ss.selectItemWarp} key={item.topicid}>
        {/* <Avatar size={20} image={item.avatar} /> */}
        <div className={ss.name}>{item.topic_name}</div>
        <CloseBtnIcon style={{ cursor: 'pointer' }} onClick={() => handleCheck(item, 'delete')} />
      </div>
    ),
    [selectedArr.length],
  );

  const CheckBoxItem = useCallback(
    (item: any) => {
      const isCheck = selectedArr.includes(item);
      return (
        <div
          className={ss.checkBoxItem}
          key={item.topicid}
          onClick={() => handleCheck(item, isCheck ? 'delete' : 'check')}
        >
          {isCheck ? <CheckedIcon /> : <div className={ss.unChecked} />}
          {/* <Avatar image={item.avatar} shape="circle" style={{ marginLeft: 12 }} /> */}
          <div className={ss.name}>{item.topic_name}</div>
          {/* <div className={ss.id}>{item.topicid}</div> */}
        </div>
      );
    },
    [selectedArr.length],
  );

  const ShowDownList = useCallback(() => {
    if (!createTopicList || createTopicList.length === 0) {
      return null;
    }
    return (
      <div className={ss.showListWarp}>
        <div style={{ display: visible ? 'block' : 'none' }} className={ss.showList} >
          {createTopicList.map(CheckBoxItem)}
        </div>
      </div>
    );
  }, [visible, CheckBoxItem]);

  return (
    <>
      <div className={ss.selectTopicContainer}>
        <div className={ss.wrap}>
          {selectedArr.map(SelectItem)}
          <input className={ss.input} type="text" placeholder="Select topics" onFocus={show} />
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
