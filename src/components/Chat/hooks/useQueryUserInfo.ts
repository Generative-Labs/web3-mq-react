import { useState, useCallback } from 'react';
import { getUserPublicProfileRequest } from 'web3-mq';
import type { Client, SearchUsersResponse } from 'web3-mq';

import { getDidsByRss3, getProfileFromRss3 } from '../../../lens/api';
import { ACCOUNT_CONNECT_TYPE, WEB3_MQ_DID_TYPE } from '../../../types/enum';
import { getShortAddress, getUserAvatar } from '../../../utils';

export type SearchDidType = 'eth' | 'starknet' | 'web3mq'

export const PROVIDER_ID_CONFIG: Record<ACCOUNT_CONNECT_TYPE, any> = {
  [ACCOUNT_CONNECT_TYPE.LENS]: 'web3mq:lens.xyz',
  [ACCOUNT_CONNECT_TYPE.EMAIL]: 'web3mq:email:SwapChat',
  [ACCOUNT_CONNECT_TYPE.PHONE]: 'web3mq:sms:SwapChat',
  [ACCOUNT_CONNECT_TYPE.ENS]: 'web3mq:ens:SwapChat',
  [ACCOUNT_CONNECT_TYPE.DOTBIT]: 'web3mq:dotbit:SwapChat',
};


export type DidValueType = {
  did_type: WEB3_MQ_DID_TYPE;
  did_value: string;
  provider_id: string;
  detail: any;
};

export type CommonUserInfoType = {
  defaultUserName: string;
  defaultUserAvatar: string;
  address: string;
  didValues: DidValueType[];
  userid: string;
  stats: {
    total_followers: number;
    total_following: number;
  };
  wallet_type: string;
  wallet_address: string;
  permissions?: any;
  didValueMap: Record<WEB3_MQ_DID_TYPE, string>;
};

export const useQueryUserInfo = (client: Client) => {
  const [loginUserInfo, setLoginUserInfo] = useState<CommonUserInfoType | null>(null);
  const getUserInfo = async (
    didValue: string,
    didType: SearchDidType,
    bindDid: boolean = false,
  ): Promise<CommonUserInfoType | null> => {
    const web3MqInfo = await getUserPublicProfileRequest({
      did_type: didType,
      did_value: didValue,
      timestamp: Date.now(),
      my_userid: client.keys.userid,
    }).catch((e) => {
      console.log(e);
    });

    if (web3MqInfo && web3MqInfo.data) {
      const info = web3MqInfo.data;
      const userInfo: CommonUserInfoType = {
        ...info,
        address: info.wallet_address,
        defaultUserName: getShortAddress(info.wallet_address),
        defaultUserAvatar: getUserAvatar(info.wallet_address),
        didValueMap: {
          [WEB3_MQ_DID_TYPE.LENS]: '',
          [WEB3_MQ_DID_TYPE.ENS]: '',
          [WEB3_MQ_DID_TYPE.DOTBIT]: '',
          [WEB3_MQ_DID_TYPE.PHONE]: '',
          [WEB3_MQ_DID_TYPE.EMAIL]: '',
        },
      };
      // 组装did数据
      if (info.bind_did_list && info.bind_did_list.length > 0) {
        info.bind_did_list.forEach((item: any) => {
          userInfo.didValueMap[item.did_type as WEB3_MQ_DID_TYPE] = item.did_value;
        });
      }
      const rss3Dids = await getDidsByRss3(info.wallet_address);
      if (rss3Dids) {
        if (rss3Dids.avatar) {
          userInfo.defaultUserAvatar = rss3Dids.avatar;
        }
        const oriDidValue = {
          ...userInfo.didValueMap,
        };
        if (rss3Dids.ensInfo && rss3Dids.ensInfo.name) {
          userInfo.didValueMap.ens = rss3Dids.ensInfo.name;
          if (!oriDidValue.ens && bindDid) {
            await client.user.userBindDid({
              provider_id: PROVIDER_ID_CONFIG.ens,
              did_type: WEB3_MQ_DID_TYPE.ENS,
              did_value: rss3Dids.ensInfo.name,
            });
          }
        }
        if (rss3Dids.lensInfo && rss3Dids.lensInfo.name) {
          userInfo.didValueMap.ens = rss3Dids.ensInfo.name;
          if (!oriDidValue['lens.xyz'] && bindDid) {
            await client.user.userBindDid({
              provider_id: PROVIDER_ID_CONFIG.lens,
              did_type: WEB3_MQ_DID_TYPE.LENS,
              did_value: rss3Dids.lensInfo.name,
            });
          }
        }
      }
      // username
      if (info.nickname) {
        userInfo.defaultUserName = info.nickname;
      } else {
        const rss3Profile = await getProfileFromRss3(info.wallet_address);
        userInfo.defaultUserName = rss3Profile.defaultUserName;
      }
      if (info.avatar_url) {
        userInfo.defaultUserAvatar = info.avatar_url;
      }

      return userInfo;
    }
    return null;
  };

  const getLoginUserInfo = async () => {
    const myProfile = await client.user.getMyProfile();
    if (myProfile && myProfile.wallet_address) {
      const info = await getUserInfo(myProfile.wallet_address, myProfile.wallet_type as SearchDidType);
      if (info) {
        // 设置permissions
        const permissions = await client.user.getUserPermissions().catch((e) => console.log(e));
        if (permissions && permissions.permissions) {
          info.permissions = permissions.permissions;
        }
        setLoginUserInfo(info);
      }
    }
  };

  return {
    getUserInfo,
    loginUserInfo,
    getLoginUserInfo,
  };
};
