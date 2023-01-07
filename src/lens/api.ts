import { getOneProfileQuery } from './lensApiQueryConfig';
import { getShortAddress } from '../utils';

import { RSS3_USER_DID_PROFILE_PLATFORM } from '../types/enum';

export const getDidsByRss3 = async (user: string) => {
  const options = { method: 'GET', headers: { accept: 'application/json' } };
  const profiles = await fetch(`https://pregod.rss3.dev/v1/profiles/${user}`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));
  if (profiles && profiles.result && profiles.result.length > 0) {
    const { result } = profiles;
    let userInfo = {
      avatar: '',
      lensInfo: result.find((item: any) => item.platform === RSS3_USER_DID_PROFILE_PLATFORM.lens),
      ensInfo: result.find((item: any) => item.platform === RSS3_USER_DID_PROFILE_PLATFORM.ens),
      // bitInfo: null,
      csbInfo: result.find((item: any) => item.platform === RSS3_USER_DID_PROFILE_PLATFORM.csb),
    };
    const item = userInfo.ensInfo
      ? userInfo.ensInfo
      : userInfo.lensInfo
        ? userInfo.lensInfo
        : userInfo.csbInfo
          ? userInfo.csbInfo
          : null;
    if (item && item.profile_uri && item.profile_uri[0]) {
      userInfo.avatar = item.profile_uri[0];
    }
    return userInfo;
  }
  return null;
};
export const getProfileFromRss3 = async (user: string) => {
  const options = { method: 'GET', headers: { accept: 'application/json' } };
  let profile = await fetch(`https://pregod.rss3.dev/v1/ns/${user}`, options)
    .then((response) => response.json())
    .catch((err) => console.error(err));
  profile.defaultUserName = profile.ens
    ? profile.ens
    : profile.bit
      ? profile.bit
      : profile.lens
        ? profile.lens
        : profile.crossbell
          ? profile.crossbell
          : getShortAddress(profile.address || '');
  return profile;
};
