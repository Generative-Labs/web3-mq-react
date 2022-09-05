/**
 * @file A round avatar image with fallback to username's first letter
 */

import React, { useEffect, useState } from 'react';
import { UserDefault } from '../../assets/userDefault';
import cx from 'classnames';

import ss from './index.scss';

export type AvatarProps = {
  className?: string;
  style?: React.CSSProperties;
  /** Image URL or default is an image of the first initial of the name if there is one  */
  image?: string | null;
  /** Name of the image, used for title tag fallback */
  name?: string;
  /** Shape of the avatar - circle, rounded or square
   * @default circle
   */
  shape?: 'circle' | 'rounded' | 'square';
  /** Size in pixels
   * @default 32px
   */
  size?: number;
  /** click event handler */
  onClick?: (event: React.BaseSyntheticEvent) => void;
  /** mouseOver event handler */
  onMouseOver?: (event: React.BaseSyntheticEvent) => void;
};

export const Avatar = (props: AvatarProps) => {
  const {
    className,
    style,
    image,
    name,
    onClick = () => undefined,
    onMouseOver = () => undefined,
    shape = 'circle',
    size = 32,
  } = props;

  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [image]);

  const nameStr = name?.toString() || '';
  const initials = nameStr.slice(0, 1);
  return (
    <div
      className={cx(className, ss.avatarContainer, ss[shape])}
      onClick={onClick}
      onMouseOver={onMouseOver}
      style={{
        flexBasis: `${size}px`,
        fontSize: `${size / 2}px`,
        height: `${size}px`,
        lineHeight: `${size}px`,
        width: `${size}px`,
        ...style,
      }}
      title={name}
    >
      {image && !error ? (
        <img
          alt={initials}
          className={cx(ss.img, {
            [ss.imgLoaded]: loaded,
          })}
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
          src={image}
          style={{
            flexBasis: `${size}px`,
            height: `${size}px`,
            objectFit: 'cover',
            width: `${size}px`,
          }}
        />
      ) : (
        <UserDefault />
      )}
    </div>
  );
};
