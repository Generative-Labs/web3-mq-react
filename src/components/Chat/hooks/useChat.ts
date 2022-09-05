import { useState } from 'react';

export const useChat = () => {
  const [showCreateChannel, setShowCreateChannel] = useState<boolean>(false);
  return {
    showCreateChannel,
    setShowCreateChannel,
  };
};
