import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

import ss from './index.scss';


export type WindowProps = {
  className?: string;
  hasContainer?: boolean;
};

const UnMemoizedWindow = (props: PropsWithChildren<WindowProps>) => {
  const { className, hasContainer = false,  children } = props;

  return (
    <div className={cx(ss.windowContainer, className, {
      [ss.hasContainerId]: hasContainer
    })}
    >
      {children}
    </div>
  );
};

export const Window = React.memo(UnMemoizedWindow);
