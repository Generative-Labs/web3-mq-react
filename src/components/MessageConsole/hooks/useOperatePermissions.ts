import { useMemo, useState } from 'react';
import type { Client } from '@web3mq/client';

type PermissionType = Record<string, { type: string; value: string }>;
type UserPermissionsType = {
  permissions: PermissionType,
  follow_status: 'follower' | 'following' | 'follow_each' | '';
  target_userid: string,
}
export const useOperatePermissions = (client: Client) => {
  const [targetUserPermissions, setTargetUserPermissions] = useState<UserPermissionsType>({
    permissions: {},
    follow_status: '',
    target_userid: '',
  });

  const toChatTargetUser = useMemo(() => {
    const { permissions, follow_status } = targetUserPermissions;
    if (!permissions['user:chat']) return false;
    const { value } = permissions['user:chat'];
    if (value === 'public' || 
      value === 'follower' && (follow_status === 'follow_each' || follow_status === 'following') ||
      value === 'following' && (follow_status === 'follow_each' || follow_status === 'follower') ||
      value === 'friend' && follow_status === 'follow_each'
    ) return true;
    return false; 
  }, [targetUserPermissions]);

  const getTargetUserPermissions = async (userId: string) => {
    const { data } = await client.user.getTargetUserPermissions(userId);
    const { permissions, follow_status, target_userid } = data;
    // permisssions key "user:chat"为空 默认为最高权限
    if (!permissions['user:chat']) {
      permissions['user:chat'] = {
        type: 'enum',
        value: 'friend'
      };
    }
    setTargetUserPermissions({
      ...targetUserPermissions,
      permissions,
      follow_status,
      target_userid
    });
  };

  const updateTargetUserPermissions = (
    type: 'permissions' | 'follow_status' | 'target_userid', 
    newValue: PermissionType | UserPermissionsType['follow_status'] | string
  ) => {
    setTargetUserPermissions(preValue => ({
      ...preValue,
      [type]: newValue
    }));
  };

  return {
    targetUserPermissions,
    toChatTargetUser,
    getTargetUserPermissions,
    updateTargetUserPermissions
  };
};