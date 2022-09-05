import { useEffect, useCallback } from 'react';

export interface ILongPressEventsProps {
  onStartCallback: (event: React.BaseSyntheticEvent) => void;
  onEndCallback?: (event: React.BaseSyntheticEvent) => void;
  ref: React.MutableRefObject<HTMLDivElement | null>;
  ms?: number;
}

type ILongPressStartMethod = (event: React.TouchEvent) => void;
type ILongPressEndMethod = (event: React.TouchEvent) => void;

export interface RLongPressEventsReturnTypes {
  onTouchStart: ILongPressStartMethod;
  onTouchMove: ILongPressEndMethod;
  onTouchEnd: ILongPressEndMethod;
}

export const uselongPressEvents = function ({
  onStartCallback,
  onEndCallback,
  ms = 1000,
  ref,
}: ILongPressEventsProps): RLongPressEventsReturnTypes {
  let timeout: NodeJS.Timeout;

  const start: ILongPressStartMethod = (event) => {
    timeout = setTimeout(() => onStartCallback(event), ms);
  };
  const stop: ILongPressEndMethod = (event) => {
    timeout && window.clearTimeout(timeout);
    onEndCallback?.(event);
  };

  const handleEvent = useCallback(
    (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        stop(e);
      }
    },
    [ref.current],
  );

  //   useEffect(() => {
  //     if (ref.current) {
  //       ref.current.ontouchstart = start;
  //     }
  //   }, []);

  useEffect(() => {
    document.addEventListener('click', handleEvent, false);
    document.addEventListener('touchstart', handleEvent, false);
    return () => {
      document.removeEventListener('click', handleEvent, false);
      document.addEventListener('touchstart', handleEvent, false);
    };
  }, []);

  return {
    onTouchStart: start,
    onTouchMove: stop,
    onTouchEnd: stop,
  };
};
