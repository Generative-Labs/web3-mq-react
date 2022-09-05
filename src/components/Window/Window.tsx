import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

import ss from './index.scss';

export type WindowProps = {
  className?: string;
};

const UnMemoizedWindow = (props: PropsWithChildren<WindowProps>) => {
  const { className, children } = props;
  return <div className={cx(ss.windowContainer, className)}>{children}</div>;
};

export const Window = React.memo(UnMemoizedWindow);
