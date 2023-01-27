import { useState, useCallback } from 'react';
import type { EventTypes, Client } from 'web3-mq';

export const useSelectedContacts = (client: Client) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);

  const handleEvent = useCallback((props: { type: EventTypes }) => {
    const { type } = props;

    const { contactList } = client.contact;
    if (!contactList) {
      return;
    }
    // if (!activeContact && contactList.length !== 0) {
    //   changeActiveContactEvent(contactList[0]);
    // }
    if (type === 'contact.getContactList') {
      setContacts(contactList);
    }
    if (type === 'contact.updateContactList') {
      setContacts(contactList);
      return;
    }
  }, []);

  const handleSelectedContact = useCallback(
    (contact: any) => {
      if (contact.userid === '-1') return;
      // select
      const _selectedContacts = [...selectedContacts, contact];
      setSelectedContacts(_selectedContacts);
    },
    [selectedContacts],
  );

  const handleDeleteContact = useCallback(
    (delContact: any) => {
      // del
      const _selectedUsers = [...selectedContacts];
      setSelectedContacts(_selectedUsers.filter((user) => user.userid !== delContact.userid));
    },
    [selectedContacts],
  );

  const handleCleanSelected = () => {
    setSelectedContacts([]);
  };

  return {
    contacts,
    selectedContacts,
    handleCleanSelected,
    handleEvent,
    handleDeleteContact,
    handleSelectedContact,
  };
};
