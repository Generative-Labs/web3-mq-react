import { useState } from 'react';

const useToggle = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  const toggle = () => {
    setVisible(!visible);
  };
  return { visible, show, hide, toggle };
};

export default useToggle;
