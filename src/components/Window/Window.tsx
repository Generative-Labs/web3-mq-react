import React, { PropsWithChildren } from 'react';
import { useChatContext } from 'context';
import cx from 'classnames';

import ss from './index.scss';


export type WindowProps = {
  className?: string;
};

const UnMemoizedWindow = (props: PropsWithChildren<WindowProps>) => {
  const { className, children } = props;
  const { containerId } = useChatContext();
  return (
    <div className={cx(ss.windowContainer, className, {
      [ss.hasContainerId]: containerId
    })}
    >
      {children}
    </div>
  );
};

export const Window = React.memo(UnMemoizedWindow);
