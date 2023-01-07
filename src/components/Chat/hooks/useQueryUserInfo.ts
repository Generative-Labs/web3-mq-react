import { useState, useCallback } from 'react';
import { getUserPublicProfileRequest } from 'web3-mq';
import type { Client, SearchUsersResponse } from 'web3-mq';

import { getDidsByRss3, getProfileFromRss3 } from '../../../lens/api';
import { ACCOUNT_CONNECT_TYPE, WEB3_MQ_DID_TYPE } from '../../../types/enum';
import { getUserAvatar } from '../../../utils';

export type didValueType = Record<WEB3_MQ_DID_TYPE, any>;

export const PROVIDER_ID_CONFIG: Record<ACCOUNT_CONNECT_TYPE, any> = {
  [ACCOUNT_CONNECT_TYPE.LENS]: 'web3mq:lens.xyz',
  [ACCOUNT_CONNECT_TYPE.EMAIL]: 'web3mq:email:SwapChat',
  [ACCOUNT_CONNECT_TYPE.PHONE]: 'web3mq:sms:SwapChat',
  [ACCOUNT_CONNECT_TYPE.ENS]: 'web3mq:ens:SwapChat',
  [ACCOUNT_CONNECT_TYPE.DOTBIT]: 'web3mq:dotbit:SwapChat',
};

export type UserInfoType = {
  defaultUserName?: string;
  defaultUserAvatar?: string;
  address: string;
  ens?: string;
  bit?: string;
  lens?: string;
  web3mqInfo: (SearchUsersResponse & { didValues?: didValueType }) | null;
  lensInfo?: any;
  ensInfo?: any;
  bitInfo?: any;
  csbInfo?: any;
  permissions?: any;
  [key: string]: any;
};

export const useQueryUserInfo = (client: Client) => {
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);

  const setUserDid = async (dids: any[]) => {
    let res: didValueType = {
      [WEB3_MQ_DID_TYPE.PHONE]: '',
      [WEB3_MQ_DID_TYPE.EMAIL]: '',
      [WEB3_MQ_DID_TYPE.LENS]: null,
      [WEB3_MQ_DID_TYPE.ENS]: '',
      [WEB3_MQ_DID_TYPE.DOTBIT]: '',
    };
    if (dids && dids.length > 0) {
      dids.forEach((item: any) => {
        if (item.did_value) {
          if (item.did_type === WEB3_MQ_DID_TYPE.EMAIL) {
            res[WEB3_MQ_DID_TYPE.EMAIL] = item.did_value;
          }
          if (item.did_type === WEB3_MQ_DID_TYPE.PHONE) {
            res[WEB3_MQ_DID_TYPE.PHONE] = item.did_value;
          }
          if (item.did_type === WEB3_MQ_DID_TYPE.ENS) {
            res[WEB3_MQ_DID_TYPE.ENS] = item.did_value;
          }
          if (item.did_type === WEB3_MQ_DID_TYPE.DOTBIT) {
            res[WEB3_MQ_DID_TYPE.DOTBIT] = item.did_value;
          }
        }
      });
      const lensInfo = dids.find((item: any) => item.did_type === WEB3_MQ_DID_TYPE.LENS);
      if (lensInfo) {
        // 有lens信息
        const lensHandle = lensInfo.did_value;
        res[WEB3_MQ_DID_TYPE.LENS] = {
          handle: lensHandle,
        };
      }
    }
    return res;
  };
  const getUserProfileBase = async (address: string) => {
    const commonProfile = await getProfileFromRss3(address);
    let LoginUserInfo: UserInfoType = {
      ...commonProfile,
      defaultUserAvatar: getUserAvatar(commonProfile.address),
      lensInfo: null,
      ensInfo: null,
      bitInfo: null,
      csbInfo: null,
    };
    // all did on instance
    const profiles = await getDidsByRss3(LoginUserInfo.address as string);
    if (profiles) {
      if (profiles.avatar) {
        LoginUserInfo.defaultUserAvatar = profiles.avatar;
      }
      if (profiles.lensInfo) {
        LoginUserInfo.lensInfo = profiles.lensInfo;
        if (LoginUserInfo.lensInfo.name) {
          LoginUserInfo.lens = LoginUserInfo.lensInfo.name;
        }
      }
      if (profiles.ensInfo) {
        LoginUserInfo.ensInfo = profiles.ensInfo;
        if (LoginUserInfo.ensInfo.name) {
          LoginUserInfo.ens = LoginUserInfo.ensInfo.name;
        }
      }
      if (profiles.csbInfo) {
        LoginUserInfo.csbInfo = profiles.csbInfo;
      }
    }
    return LoginUserInfo;
  };

  // 初始化当前登陆用户信息
  const getLoginUserInfo = useCallback(async () => {
    const myProfile = await client.user.getMyProfile();
    if (myProfile) {
      let loginUserInfo = await getUserProfileBase(myProfile.wallet_address);
      loginUserInfo.web3mqInfo = myProfile;
      const permissions = await client.user.getUserPermissions().catch((e) => console.log(e));
      if (permissions && permissions.permissions) {
        loginUserInfo.permissions = permissions.permissions;
      }

      if (loginUserInfo.ens) {
        await client.user.userBindDid({
          provider_id: PROVIDER_ID_CONFIG.ens,
          did_type: WEB3_MQ_DID_TYPE.ENS,
          did_value: loginUserInfo.ens,
        });
      }
      if (loginUserInfo.lens) {
        await client.user.userBindDid({
          provider_id: PROVIDER_ID_CONFIG.lens,
          did_type: WEB3_MQ_DID_TYPE.LENS,
          did_value: loginUserInfo.lens,
        });
      }
      if (loginUserInfo.bit) {
        await client.user.userBindDid({
          provider_id: PROVIDER_ID_CONFIG.dotbit,
          did_type: WEB3_MQ_DID_TYPE.DOTBIT,
          did_value: loginUserInfo.bit,
        });
      }
      const dids = await client.user.getUserBindDids();
      if (dids) {
        loginUserInfo.web3mqInfo.didValues = await setUserDid(dids);
      }
      setUserInfo(loginUserInfo);
    }
  }, []);
  // 获取其他用户信息
  const getUserInfo = useCallback(async (userid: string) => {
    let otherUserInfo: UserInfoType = {
      address: '',
      web3mqInfo: null,
    };
    try {
      const web3MqInfo = await getUserPublicProfileRequest({
        did_type: 'web3mq',
        did_value: userid,
        timestamp: Date.now(),
        my_userid: client.keys.userid,
      }).catch((e) => {
        console.log(e);
      });
      if (web3MqInfo && web3MqInfo.data) {
        otherUserInfo = await getUserProfileBase(web3MqInfo.data.wallet_address);
        otherUserInfo.web3mqInfo = web3MqInfo.data;
        if (
          otherUserInfo.web3mqInfo &&
          web3MqInfo.data.bind_did_list &&
          web3MqInfo.data.bind_did_list.length > 0
        ) {
          otherUserInfo.web3mqInfo.didValues = await setUserDid(web3MqInfo.data.bind_did_list);
        }
      }
      return otherUserInfo;
    } catch (e) {
      console.log(e, 'e');
      return otherUserInfo;
    }
  }, []);

  return {
    userInfo,
    getLoginUserInfo,
    getUserInfo,
  };
};
