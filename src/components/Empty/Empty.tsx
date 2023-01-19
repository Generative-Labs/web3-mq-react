import React from 'react';
import cx from 'classnames';

import ss from './index.scss';

export type EmptyProps = {
  className?: string;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
};

export const Empty: React.FC<EmptyProps> = React.memo((props) => {
  const { className, description, icon, style } = props;
  return (
    <div className={cx(ss.EmptyContainer, className)} style={style}>
      {icon && <div className={ss.emptyIcon}>{icon}</div>}
      <div className={ss.emptyDescription}>
        { description ? (
          description
        ) : (
          'No data yet'
        )}
      </div>
    </div>
  );
});