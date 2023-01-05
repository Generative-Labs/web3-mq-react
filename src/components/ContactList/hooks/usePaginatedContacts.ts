import { useState, useEffect, useCallback } from 'react';
import type { EventTypes, Client } from 'web3-mq';

type StatusType = {
  error: boolean;
  loading: boolean;
};

const PAGE = {
  page: 1,
  size: 20,
};

export const usePaginatedContacts = (
  client: Client,
  getUserInfo: (userid: string) => Promise<any>,
) => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeContact, setActiveContact] = useState<any | null>(null);
  const [status, setStatus] = useState<StatusType>({
    error: false,
    loading: false,
  });

  const queryContacts = async () => {
    setRefreshing(true);
    await client.contact.getContactList(PAGE);
    setRefreshing(false);
  };

  // @ts-ignore
  const changeActiveContactEvent = (contact: any) => {
    // client.contact.setActiveContact(contact);
  };

  const loadNextPage = () => {
    if ((client.contact.contactList?.length || 0) < PAGE.size) {
      return;
    }
    PAGE.page++;
    queryContacts();
  };

  // const renderContact
  const renderContactList = async (contactList: any[]) => {
    await Promise.all(
      contactList.map(async (contact) => {
        // 通过是否存在web3mqInfo和address字段来判断
        if (!contact.hasOwnProperty('web3mqInfo') || !contact.hasOwnProperty('address')) {
          const info = await getUserInfo(contact.userid);
          for (let key in info) {
            if (info.hasOwnProperty(key)) {
              contact[key] = info[key];
            }
          }
        }
      }),
    );
  };

  const handleEvent = useCallback(async (props: { type: EventTypes }) => {
    const { type } = props;

    const { contactList } = client.contact;
    if (!contactList) {
      return;
    }
    // if (!activeContact && contactList.length !== 0) {
    //   changeActiveContactEvent(contactList[0]);
    // }
    if (type === 'contact.getList') {
      await renderContactList(contactList);
      setContacts(contactList);
    }
    if (type === 'contact.activeChange') {
      setActiveContact(activeContact);
      return;
    }
    if (type === 'contact.updateList') {
      await renderContactList(contactList);
      setContacts(contactList);
      return;
    }
    setStatus({
      ...status,
      loading: false,
    });
    // setContacts((contacts: any[]) => [...contacts, ...contactList]);
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
