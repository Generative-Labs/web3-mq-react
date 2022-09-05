import { useState, useEffect, useCallback } from 'react';
import type { EventTypes, UserInfo, Client } from 'web2-mq';

type StatusType = {
  error: boolean;
  loading: boolean;
};

const PAGE = {
  page: 1,
  size: 20,
};

export const usePaginatedContacts = (client: Client) => {
  const [contacts, setContacts] = useState<UserInfo[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeContact, setActiveContact] = useState<UserInfo | null>(null);
  const [status, setStatus] = useState<StatusType>({
    error: false,
    loading: false,
  });

  const queryContacts = async () => {
    setRefreshing(true);
    await client.contact.queryContacts(PAGE);
    setRefreshing(false);
  };

  const changeActiveContactEvent = (contact: UserInfo) => {
    client.contact.setActiveContact(contact);
  };

  const loadNextPage = () => {
    if ((client.contact.contactList?.length || 0) < PAGE.size) {
      return;
    }
    PAGE.page++;
    queryContacts();
  };

  const handleEvent = useCallback((props: { type: EventTypes }) => {
    const { type } = props;

    const { contactList, activeContact } = client.contact;
    if (!contactList) {
      return;
    }
    // if (!activeContact && contactList.length !== 0) {
    //   changeActiveContactEvent(contactList[0]);
    // }
    if (type === 'contact.activeChange') {
      setActiveContact(activeContact);
      return;
    }
    if (type === 'contact.updateList') {
      setContacts(contactList);
      return;
    }
    setStatus({
      ...status,
      loading: false,
    });
    setContacts((contacts: UserInfo[]) => [...contacts, ...contactList]);
  }, []);

  useEffect(() => {
    setStatus({
      ...status,
      loading: true,
    });
    queryContacts();
  }, []);

  return {
    status,
    contacts,
    refreshing,
    loadNextPage,
    handleEvent,
    queryContacts,
    changeActiveContactEvent,
    activeContact,
  };
};
