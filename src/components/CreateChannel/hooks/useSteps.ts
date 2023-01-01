import React, { useState, useCallback } from 'react';

import { AddFriends } from '../AddFriends';
import { CreateRoom } from '../CreateRoom';
import { SelectContacts } from '../SelectContacts';

export enum StepTitleEnum {
  ADDFRIENDS = 'Add friends',
  CREATEROOM = 'Create room',
}
export type StepType = {
  id: string;
  title: string;
  Component: React.ComponentType<any>;
};
const AddFriendSteps: Array<StepType> = [
  {
    id: 'add friends',
    title: StepTitleEnum['ADDFRIENDS'],
    Component: AddFriends,
  },
];
const CreateRoomSteps: Array<StepType> = [
  {
    id: 'select user',
    title: StepTitleEnum['CREATEROOM'],
    Component: SelectContacts,
  },
  {
    id: 'create room',
    title: StepTitleEnum['CREATEROOM'],
    Component: CreateRoom,
  },
];

export const useSteps = () => {
  const [steps, setSteps] = useState<StepType[]>([]);
  const [current, setCurrent] = useState<number>(0);

  const handleUpdateSteps = useCallback((type: StepTitleEnum) => {
    if (type === StepTitleEnum['ADDFRIENDS']) {
      setSteps(AddFriendSteps);
    } else if (type === StepTitleEnum['CREATEROOM']) {
      setSteps(CreateRoomSteps);
    }
  }, []);

  const handleCleanSteps = useCallback(() => {
    setSteps([]);
  }, []);

  const handleNext = useCallback(() => {
    setCurrent(current + 1);
  }, [current]);

  const handlePrev = useCallback(() => {
    // 第一页 清空队列
    if (current < 1) {
      handleCleanSteps();
      return;
    } else if (current >= 1) {
      setCurrent(current - 1);
    }
  }, [current, handleCleanSteps]);

  return {
    steps,
    current,
    handleCleanSteps,
    handleUpdateSteps,
    handleNext,
    handlePrev,
    setCurrent,
  };
};
