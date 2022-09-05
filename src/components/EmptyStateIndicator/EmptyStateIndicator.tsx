import React from 'react';
import ss from './index.scss';

export type EmptyStateIndicatorProps = {
  listType: 'channel' | 'message' | 'contact';
};

const UnMemoizedEmptyStateIndicator: React.FC<EmptyStateIndicatorProps> = (props) => {
  const { listType } = props;

  if (listType === 'message') return null;

  return (
    <div className={ss.emptyContainer}>
      {listType === 'channel' && <p>You have no channels currently</p>}
      {listType === 'contact' && <p>You have no contact currently</p>}
    </div>
  );
};

export const EmptyStateIndicator = React.memo(
  UnMemoizedEmptyStateIndicator,
) as typeof UnMemoizedEmptyStateIndicator;
