import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import cx from 'classnames';

import { Loading as DefaultLoading, LoadingProps } from '../Loading';

import ss from './index.scss';

export type PaginatorProps = {
  loadNextPage: () => any;
  element?: React.MutableRefObject<HTMLDivElement | null>;
  Loading?: React.ComponentType<LoadingProps>;
  showLoading?: boolean;
  reverse?: boolean;
  useCapture?: boolean;
};

export const UnMemoizedPaginator = (props: PropsWithChildren<PaginatorProps>) => {
  const {
    children,
    element,
    showLoading = false,
    Loading = DefaultLoading,
    loadNextPage,
    reverse = false,
    useCapture = true,
  } = props;

  const handleScroll = useCallback(async () => {
    if (element && element.current) {
      const el = element.current;
      const { scrollHeight, clientHeight, scrollTop } = el;
      if (reverse && scrollTop === 0) {
        const hasMore = await loadNextPage();
        !hasMore && (el.scrollTop = getCurrentHeight(el) - scrollHeight);
      }
      if (!reverse && scrollHeight - scrollTop === clientHeight) {
        loadNextPage();
      }
    }
  }, []);

  const getCurrentHeight = useCallback((el: HTMLDivElement) => {
    return el.scrollHeight;
  }, []);

  useEffect(() => {
    if (!element || !element.current) {
      return;
    }
    const scrollElement = element.current;
    getCurrentHeight(scrollElement);
    scrollElement.addEventListener('scroll', handleScroll, useCapture);
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll, useCapture);
    };
  }, []);

  const Tip = useCallback(() => {
    if (showLoading) {
      return (
        <Loading
          className={cx(ss.loadBtn, {
            [ss.btnPosition]: reverse,
          })}
          type="spin"
        />
      );
    }
    return null;
  }, [showLoading]);

  return (
    <div
      className={cx(ss.paginatorContainer, {
        [ss.paddingTop]: reverse,
      })}
    >
      {!reverse && children}
      <Tip />
      {reverse && children}
    </div>
  );
};

export const Paginator = React.memo(UnMemoizedPaginator);
