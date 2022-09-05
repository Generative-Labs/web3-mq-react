import { useState } from "react";

const useToggle = () => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggle = () => {
    setVisible(!visible);
  };
  return { visible, toggle };
};

export default useToggle;
