import React from 'react';
import cx from 'classnames';

import ss from './index.scss';

export enum ButtonSize {
  large = 'large',
  small = 'small',
}

export enum ButtonType {
  default = 'default',
  primary = 'primary',
  danger = 'danger',
  link = 'link',
}

interface BaseButtonProps {
  className?: string;
  disable?: boolean;
  size?: ButtonSize | string;
  btnType?: ButtonType | string;
  children: React.ReactNode;
  href?: string;
}

type NativeButtonProps = BaseButtonProps & React.ButtonHTMLAttributes<HTMLElement>;
type AnchorButtonProps = BaseButtonProps & React.AnchorHTMLAttributes<HTMLElement>;
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    btnType = ButtonType.default,
    className,
    disable = false,
    size = ButtonSize.small,
    children,
    href,
    ...restProps
  } = props;

  const classes = cx(ss.buttonContainer, className, ss[btnType], ss[size], {
    disabled: btnType === ButtonType.link && disable,
  });

  if (btnType === ButtonType.link && href) {
    return (
      <a className={classes} href={href} {...restProps}>
        {children}
      </a>
    );
  }
  return (
    <button className={classes} disabled={disable} {...restProps}>
      {children}
    </button>
  );
};
