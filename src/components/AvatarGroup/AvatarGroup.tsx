import React, { useMemo } from 'react';
import cx from 'classnames';

import { Avatar, AvatarProps } from '../Avatar';

import ss from './index.scss';

export interface AvatarGroupProps extends Omit<AvatarProps, 'image'> {
  images: string[];
}

export const AvatarGroup = (props: AvatarGroupProps) => {
  const {
    className,
    style,
    images,
    name,
    onClick = () => undefined,
    onMouseOver = () => undefined,
    shape = 'circle',
    size = 32,
  } = props;

  const trustImages = useMemo(() => {
    if (images) {
      const len = images.length || 0;
      return len > 4 ? images?.slice(0, 4) : images;
    }
    return [];
  }, [images.length]);

  const getStyle = (index: number): React.CSSProperties => {
    const len = trustImages.length;
    if (len == 2 || (len == 3 && index == 0)) {
      return {
        flexBasis: `${size}px`,
        height: `${size}px`,
        objectFit: 'cover',
        width: `${size / 2}px`,
      };
    } else if (len == 1) {
      return {
        flexBasis: `${size}px`,
        height: `${size}px`,
        objectFit: 'cover',
        width: `${size}px`,
      };
    }
    return {
      flexBasis: `${size / 2}px`,
      height: `${size / 2}px`,
      objectFit: 'cover',
      width: `${size / 2}px`,
    };
  };

  return (
    <div
      className={cx(className, ss.avatarContainer, ss[shape])}
      onClick={onClick}
      onMouseOver={onMouseOver}
      style={{
        ...style,
        flexBasis: `${size}px`,
        fontSize: `${size / 2}px`,
        height: `${size}px`,
        lineHeight: `${size}px`,
        width: `${size}px`,
      }}
      title={name}
    >
      {trustImages.map((item, idx) => (
        <Avatar key={idx} image={item} style={{ margin: 0, ...getStyle(idx) }} size={size} shape="square" />
      ))}
    </div>
  );
};
