import cx from 'classnames';
import React, { useCallback } from 'react';

import ss from './index.scss';

export type LoadingProps = {
  className?: string;
  style?: React.CSSProperties;
  type?: 'spin';
};

export const Loading: React.FC<LoadingProps> = (props) => {
  const { type, className = '', style = {} } = props;

  const LoadingComponents = useCallback(() => {
    if (type === 'spin') {
      return (
        <div className={ss.spinLoading}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      );
    }
    return <div className={ss.defaultLoading} />;
  }, [type]);

  return (
    <div style={style} className={cx(className, ss.loadingContainer)}>
      <LoadingComponents />
    </div>
  );
};
