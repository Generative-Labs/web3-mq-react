import { useMemo, useState } from 'react';
import type { Client } from '@web3mq/client';

type PermissionType = Record<string, { type: string; value: string }>;
export type UserPermissionsType = {
  permissions: PermissionType;
  follow_status: 'follower' | 'following' | 'follow_each' | '';
  target_userid: string;
};

export enum RelationEnum {
  canMessage,
  needFollow,
  needRequestFriend,
  both,
}

export const RelationAuditMaps = {
  [RelationEnum.canMessage]: 'Send Message',
  [RelationEnum.needFollow]: 'Follow',
  [RelationEnum.needRequestFriend]: 'Request',
  [RelationEnum.both]: 'Follow',
};

export const useOperatePermissions = (client: Client) => {
  const [targetUserPermissions, setTargetUserPermissions] = useState<UserPermissionsType>({
    permissions: {},
    follow_status: '',
    target_userid: '',
  });

  const toChatTargetUser = useMemo(() => {
    const { permissions, follow_status } = targetUserPermissions;
    if (!permissions['user:chat']) return RelationEnum.both;
    const { value } = permissions['user:chat'];
    if (value === 'public') {
      return RelationEnum.canMessage;
    }
    if (follow_status === 'follow_each') {
      return RelationEnum.canMessage;
    }
    if (value === 'follower') {
      if (follow_status === 'following') {
        return RelationEnum.canMessage;
      } else {
        return RelationEnum.needFollow;
      }
    }
    if (value === 'following') {
      if (follow_status === 'follower') {
        return RelationEnum.canMessage;
      } else {
        return RelationEnum.needRequestFriend;
      }
    }
    if (value === 'friend') {
      if (follow_status === 'following') {
        return RelationEnum.needRequestFriend;
      }
      if (follow_status === 'follower') {
        return RelationEnum.needFollow;
      }
    }
    return RelationEnum.both;
  }, [targetUserPermissions]);

  const getTargetUserPermissions = async (userId: string) => {
    const { data } = await client.user.getTargetUserPermissions(userId);
    const { permissions, follow_status, target_userid } = data;
    // permisssions key "user:chat"为空 默认为最高权限
    if (!permissions['user:chat']) {
      permissions['user:chat'] = {
        type: 'enum',
        value: 'friend',
      };
    }
    setTargetUserPermissions({
      ...targetUserPermissions,
      permissions,
      follow_status,
      target_userid,
    });
  };
  const updateTargetUserPermissions = (
    type: 'permissions' | 'follow_status' | 'target_userid',
    newValue: PermissionType | UserPermissionsType['follow_status'] | string,
  ) => {
    setTargetUserPermissions((preValue) => ({
      ...preValue,
      [type]: newValue,
    }));
  };

  return {
    targetUserPermissions,
    toChatTargetUser,
    getTargetUserPermissions,
    updateTargetUserPermissions,
  };
};
