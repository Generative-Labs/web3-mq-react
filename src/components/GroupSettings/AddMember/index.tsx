import React, { useCallback, useEffect, useState } from 'react';
import { useChatContext } from '../../../context/ChatContext';
import { usePaginatedMembers } from '../hooks/usePaginatedMembers';

import ss from './index.scss';
import { GroupSettingsModalTypeEnum } from '../GroupSettings';
import { Loading } from '../../Loading';
import { SelectContacts } from '../../CreateChannel/SelectContacts';
import { useSelectedContacts } from '../../CreateChannel/hooks/useSelectedContacts';

type MembersType = any;

type IProps = {
  className?: string;
  style?: React.CSSProperties;
  handleModalTypeChange: (type?: GroupSettingsModalTypeEnum) => void;
  setErrorMessage: any;
};

export const AddMember: React.FC<IProps> = (props) => {
  const { handleModalTypeChange, setErrorMessage } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const { client } = useChatContext('MessageHeader');
  const { selectedContacts, handleDeleteContact, handleSelectedContact } =
    useSelectedContacts(client);

  const { contactList } = client.contact;

  const { memberList, memberListloading } = usePaginatedMembers(client, true);

  const filterContactList = useCallback((contactList: MembersType[], memberList: MembersType[]) => {
    const memberIds = memberList.map((item: MembersType) => {
      return item.userid;
    });

    return contactList.filter((item: MembersType) => !memberIds.includes(item.userid));
  }, []);

  const resetStatus = useCallback(() => {
    setLoading(false);
  }, []);

  const handleInvite = useCallback(async () => {
    if (selectedContacts.length === 0) {
      return;
    }
    const ids = selectedContacts.map((member) => member.userid);
    setLoading(true);
    try {
      await client.channel.inviteGroupMember(ids);
      setLoading(false);
      handleModalTypeChange(GroupSettingsModalTypeEnum.Success);
    } catch (error: any) {
      handleModalTypeChange(GroupSettingsModalTypeEnum.Error);
      setErrorMessage(error.message);
      setLoading(false);
    }
  }, [selectedContacts.length]);


  return (
    <>
      {memberListloading || loading ? (
        <div className={ss.loadingBox}>
          <Loading />
        </div>
      ) : (
        <SelectContacts
          btnText={'Invite'}
          contactList={filterContactList(contactList || [], memberList)}
          selectedContacts={selectedContacts}
          handleNext={handleInvite}
          onSelected={handleSelectedContact}
          onDeleted={handleDeleteContact}
        />
      )}
    </>
  );
};
