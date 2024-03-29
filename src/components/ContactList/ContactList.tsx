import React, { PropsWithChildren, useEffect, useRef } from 'react';

import { ContactListMessenger, ContactListMessengerProps } from './ContactListMessenger';
import { usePaginatedContacts } from './hooks/usePaginatedContacts';
import { ContactPreview, ContactPreviewProps } from '../ContactPreview';
import { EmptyStateIndicator, EmptyStateIndicatorProps } from '../EmptyStateIndicator';
import { Paginator as defaultPaginator, PaginatorProps } from '../Paginator';
import { useChatContext } from '../../context';

export type ContactListProps = {
  List?: React.ComponentType<ContactListMessengerProps>;
  Preview?: React.ComponentType<ContactPreviewProps>;
  DefaultEmptyStateIndicator?: React.ComponentType<EmptyStateIndicatorProps>;
  Paginator?: React.ComponentType<PaginatorProps>;
  visible?: boolean;
};

export const ContactList = (props: PropsWithChildren<ContactListProps>) => {
  const {
    List = ContactListMessenger,
    DefaultEmptyStateIndicator = EmptyStateIndicator,
    Preview,
    Paginator = defaultPaginator,
  } = props;
  const { client, getUserInfo } = useChatContext();
  const listRef = useRef<HTMLDivElement | null>(null);

  const {
    status,
    contacts,
    refreshing,
    loadNextPage,
    handleEvent,
    activeContact,
    changeActiveContactEvent,
  } = usePaginatedContacts(client, getUserInfo);

  useEffect(() => {
    client.on('contact.getContactList', handleEvent);
    client.on('contact.activeChange', handleEvent);
    client.on('contact.updateContactList', handleEvent);
    return () => {
      client.off('contact.getContactList');
      client.off('contact.activeChange');
    };
  }, []);
  const renderContact = (item: any) => {
    const previewProps = {
      contact: item,
      Preview,
      key: item.userid,
      activeContact,
      changeActiveContactEvent,
    };
    return <ContactPreview {...previewProps} />;
  };
  return (
    <List loading={status.loading} error={status.error} listRef={listRef}>
      {contacts?.length === 0 ? (
        <DefaultEmptyStateIndicator listType="contact" />
      ) : (
        <Paginator element={listRef} showLoading={refreshing} loadNextPage={loadNextPage}>
          {contacts?.map(renderContact)}
        </Paginator>
      )}
    </List>
  );
};
