import React, { PropsWithChildren, MouseEvent } from 'react';
import cx from 'classnames';

import ss from './index.scss';

export type MqButtonSize = 'large' | 'default' | 'small';
export type MqButtonType = 'primary' | 'default' | 'danger' | 'ghost';

export type MqButtonProps = {
  block?: boolean;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  size?: MqButtonSize;
  type?: MqButtonType;
  onClick?: (event: MouseEvent) => void;
};

const sizeAbbreviation = {
  default: '',
  large: 'lg',
  small: 'sm'
};

export const MqButton: React.FC<PropsWithChildren<MqButtonProps>> = (props) => {
  const {
    block = false,
    className = '',
    children,
    disabled = false,
    icon,
    size = 'default',
    type = 'default',
    onClick = () => {},
  } = props;
  
  return (
    <button 
      className={cx(ss['mq-btn'], className, {
        [ss[`mq-btn-${type}`]]: type,
        [ss[`mq-btn-${sizeAbbreviation[size]}`]]: size !== 'default',
        [ss['mq-btn-block']]: block,
      })}
      disabled={disabled}
      onClick={(e) => onClick(e)}
    >
      {icon && <span className={ss['mq-btn-icon']}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};