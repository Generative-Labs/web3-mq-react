import React from 'react';
import cx from 'classnames';

import ss from './index.scss';

export const Empty = (props: { content: string, className?: string, style?: React.CSSProperties }) => {
  const { content, className, style } = props;
  return (
    <div className={cx(ss.emptyContainer, className)} style={style} >{content}</div>
  );
};