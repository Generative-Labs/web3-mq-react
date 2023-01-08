import { useState } from 'react';

const useToggle = (isShow?: boolean) => {
  const [visible, setVisible] = useState<boolean>(isShow || false);

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
