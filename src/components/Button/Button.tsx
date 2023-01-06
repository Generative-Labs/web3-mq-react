import React, { PropsWithChildren, MouseEvent } from 'react';
import cx from 'classnames';

import ss from './index.scss';

export type ButtonSize = 'large' | 'default' | 'small';
export type ButtonType = 'primary' | 'default' | 'danger' | 'ghost';

export type ButtonProps = {
  block?: boolean;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  size?: ButtonSize;
  type?: ButtonType;
  onClick?: (event: MouseEvent) => void;
};

const sizeAbbreviation = {
  default: '',
  large: 'lg',
  small: 'sm'
};

export const Button: React.FC<PropsWithChildren<ButtonProps>> = (props) => {
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