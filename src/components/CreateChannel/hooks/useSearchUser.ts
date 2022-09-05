import type { Client } from 'web2-mq';
import { useEffect, useState } from 'react';
import { debounce } from '../../../utils';

const defaultNoUser = {
  userName: 'No people found...',
  avatar: '',
  userId: '-1',
  createdAt: 0,
};

export const useSearchUser = (client: Client) => {
  const [content, setContent] = useState<string>('');
  const [searchResult, setSearchResult] = useState<Array<any>>([]);
  const [selectedUsers, setSelectUsers] = useState<Array<any>>([]);
  
  const resetSearchUser = () => {
    setContent('');
    setSelectUsers([]);
    setSearchResult([]);
  };

  const findUsers = async (content: string) => {
    return await client.user.queryUsers(content);
  };

  const debounceFind = debounce<any[]>(findUsers, 800, true);
  const startFind = async () => {
    let users = await debounceFind(content);
    if (users.length === 0) {
      users = [defaultNoUser];
    }
    setSearchResult(users as unknown as any[]);
  };
  useEffect(() => {
    if (content) {
      startFind();
    }
  }, [content]);

  const selectedSearchUser = (user: any) => {
    if (selectedUsers.find(item => item.userId === user.userId)) {
      return;
    }
    if (content || user.userId === '-1') {
      setContent('');
      setSearchResult([]);
      if (user.userId === defaultNoUser.userId) return;
    }

    const _selectedUsers = [...selectedUsers, user];
    setSelectUsers(_selectedUsers);
  };
  const deleteSelectUser = (delUser: any) => {
    const _selectedUsers = [...selectedUsers];
    setSelectUsers(_selectedUsers.filter((user) => user.userId !== delUser.userId));
  };
  return {
    content,
    setContent,
    searchResult,
    selectedUsers,
    selectedSearchUser,
    deleteSelectUser,
    resetSearchUser
  };
};
