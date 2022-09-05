import React from 'react';
import ss from './index.scss';

const SkeletonItems: React.FC = () => {
  return (
    <div className={ss.loadingChannelItem}>
      <div className={ss.loadingChannelAvatar} />
      <div className={ss.loadingChannelMeta}>
        <div className={ss.loadingChannelUsername} />
        <div className={ss.loadingChannelStatus} />
      </div>
    </div>
  );
};

const UnMemoizedSkeletonChannels: React.FC = () => {
  return (
    <div className={ss.loadingContainer}>
      <SkeletonItems />
      <SkeletonItems />
      <SkeletonItems />
    </div>
  );
};

export const Skeleton = React.memo(
  UnMemoizedSkeletonChannels,
) as typeof UnMemoizedSkeletonChannels;
