import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

import ss from './index.scss';

export type PopoverProps = {
  content: string | React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  // btn与popover之前的距离
  distance?: number;
};

export const Popover = (props: PropsWithChildren<PopoverProps>) => {
  const { className, style, children, content } = props;

  return (
    <div className={cx(className, ss.popover)} style={style}>
      <div className={ss.popoverCom} style={{ cursor: content ? 'pointer' : 'default' }}>
        {children}
      </div>
      {content && (
        <div className={ss.popoverBubble}>
          <div className={ss.popoverInner}>{content}</div>
          <div className={ss.popoverArrow}>
            <div className={ss.popoverArrowContent}></div>
          </div>
        </div>
      )}
    </div>
  );
};
