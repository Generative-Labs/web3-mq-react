import React, { PropsWithChildren, useEffect, useRef } from 'react';

import { ChannelListMessenger, ChannelListMessengerProps } from './ChannelListMessenger';
import { usePaginatedChannels } from './hooks/usePaginatedChannels';
import { ChannelPreview, ChannelPreviewProps } from '../ChannelPreview';
import { EmptyStateIndicator, EmptyStateIndicatorProps } from '../EmptyStateIndicator';
import { Paginator as defaultPaginator, PaginatorProps } from '../Paginator';
import { useChatContext } from '../../context/ChatContext';

export type ChannelListProps = {
  List?: React.ComponentType<ChannelListMessengerProps>;
  Preview?: React.ComponentType<ChannelPreviewProps>;
  DefaultEmptyStateIndicator?: React.ComponentType<EmptyStateIndicatorProps>;
  Paginator?: React.ComponentType<PaginatorProps>;
};

export const ChannelList = (props: PropsWithChildren<ChannelListProps>) => {
  const {
    List = ChannelListMessenger,
    DefaultEmptyStateIndicator = EmptyStateIndicator,
    Preview,
    Paginator = defaultPaginator,
  } = props;
  const { client, appType } = useChatContext();
  const listRef = useRef<HTMLDivElement | null>(null);

  const {
    status,
    refreshing,
    channels,
    loadNextPage,
    handleEvent,
    activeChannel,
    changeActiveChannelEvent,
  } = usePaginatedChannels(client, appType);

  useEffect(() => {
    client.on('channel.updated', handleEvent);
    client.on('channel.getList', handleEvent);
    client.on('channel.activeChange', handleEvent);
    client.on('channel.created', handleEvent);

    return () => {
      client.off('channel.updated');
      client.off('channel.getList');
      client.off('channel.activeChange');
      client.off('channel.created');
    };
  }, []);

  const renderChannel = (item: any) => {
    const previewProps = {
      channel: item,
      Preview,
      key: item.room_id,
      activeChannel,
      changeActiveChannelEvent,
    };
    return <ChannelPreview {...previewProps} />;
  };

  return (
    <List loading={status.loading} error={status.error} listRef={listRef}>
      {channels?.length === 0 ? (
        <DefaultEmptyStateIndicator listType="channel" />
      ) : (
        <Paginator element={listRef} showLoading={refreshing} loadNextPage={loadNextPage}>
          {channels?.map(renderChannel)}
        </Paginator>
      )}
    </List>
  );
};
