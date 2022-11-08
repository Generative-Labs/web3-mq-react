import { useState } from 'react';
import type { ListComponentType } from '../../../context/ChatContext';

export const useShowListTypeView = () => {
  const [showListTypeView, setShowListTypeView] = useState<string | ListComponentType>('room');

  return { showListTypeView, setShowListTypeView };
};
