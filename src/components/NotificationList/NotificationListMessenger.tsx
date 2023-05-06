import React, { MutableRefObject, PropsWithChildren } from 'react';

import { ChatDownProps, ChatDown } from '../ChatDown';
import { Skeleton } from '../Skeleton';

import ss from './index.scss';

export type ContactListMessengerProps = {
  listRef: MutableRefObject<HTMLDivElement | null>;
  error?: boolean;
  loading?: boolean;
  LoadingErrorIndicator?: React.ComponentType<ChatDownProps>;
  LoadingIndicator?: React.ComponentType;
};

export const NotificationListMessenger = (props: PropsWithChildren<ContactListMessengerProps>) => {
  const {
    children,
    listRef,
    error,
    loading,
    LoadingErrorIndicator = ChatDown,
    LoadingIndicator = Skeleton,
  } = props;

  if (error) {
    return <LoadingErrorIndicator type="Connection Error" />;
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return <div className={ss.notificationContainer} ref={listRef}>{children}</div>;
};
