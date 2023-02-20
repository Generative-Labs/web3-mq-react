import { useState, useCallback, useMemo } from 'react';

export const useSelectedContacts = (followList: any[]) => {
  const contacts = useMemo(() => {
    return followList.filter(follow => follow.follow_status === 'follow_each');
  }, [followList]);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);

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
    handleDeleteContact,
    handleSelectedContact,
  };
};
