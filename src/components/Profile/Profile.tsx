import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import cx from 'classnames';

import {
  ArrowLeft,
  CopyIcon,
  MessageIcon,
  AddContactIcon,
  // TwitterIcon,
  // OpenseaIcon,
  // DiscordIcon,
} from '../../icons';
import { Avatar } from '../Avatar';
import type { CommonUserInfoType } from '../Chat/hooks/useQueryUserInfo';
import { copyText } from '../../utils';
import useToggle from '../../hooks/useToggle';
import { useChatContext, AppTypeEnum } from '../../context';
import { toast } from '../Toast';

import ss from './index.scss';

type IProps = {
  userInfo?: CommonUserInfoType;
  AvatarNode?: React.ReactNode;
  isTab?: boolean;
  isSelf?: boolean;
  hasLogout?: boolean;
};

export const Profile = React.memo((props: PropsWithChildren<IProps>) => {
  const {
    AvatarNode,
    userInfo: propsUserInfo,
    isTab = false,
    isSelf = false,
    hasLogout = false,
  } = props;
  const { loginUserInfo: contextUserInfo, appType, logout } = useChatContext('Profile');
  const [copied, setCopied] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const { visible, toggle, hide } = useToggle();

  // const members = client.channel.activeChannel?.members || [];

  const userInfo = propsUserInfo || contextUserInfo;
  const { defaultUserAvatar = '', defaultUserName = '', wallet_address = '' } = userInfo || {};

  const copy = useCallback(async () => {
    const res = await copyText(wallet_address);
    setCopied(res);
    setTimeout(() => {
      setCopied(false);
    }, 800);
  }, [wallet_address]);

  const handleEvent = useCallback(
    (e: any) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        hide();
      }
    },
    [selectRef.current],
  );

  const addContact = useCallback(async () => {
    // await client.contact.addContact(userInfo as any);
    toast.success('Add contact success');
    hide();
  }, []);

  const startMessages = useCallback(async () => {
    // if (members.length > 1) {
    //   await client.channel.createRoom({
    //     user_id: message.from_uid,
    //   });
    // }
    hide();
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleEvent, false);
    return () => {
      document.removeEventListener('click', handleEvent, false);
    };
  }, []);

  const OperaBar = useCallback(() => {
    if (isSelf || hasLogout) {
      return null;
    }
    return (
      <div className={ss.opreraContainer}>
        <div className={ss.item} onClick={addContact}>
          <AddContactIcon className={ss.icon} />
          <span className={ss.text}>Add contact</span>
        </div>
        <div className={ss.item} onClick={startMessages}>
          <MessageIcon className={ss.icon} />
          <span className={ss.text}>Messages</span>
        </div>
      </div>
    );
  }, [hasLogout]);

  const PlatformList = useCallback(() => {
    return (
      <div className={ss.platformContainer}>
        <div className={ss.title}>Accounts linked to my SwapChat</div>
      </div>
    );
  }, []);

  const BackArrow = useCallback(() => {
    if (appType !== AppTypeEnum['pc'] && !isTab) {
      return <ArrowLeft className={ss.back} onClick={hide} />;
    }
    return null;
  }, [appType, isTab]);

  return (
    <div
      className={cx(ss.profileContainer, {
        [ss.isRelative]: appType === AppTypeEnum['pc'],
      })}
      ref={selectRef}
    >
      {AvatarNode && (
        <div className={ss.avatarNode} onClick={toggle}>
          {AvatarNode}
        </div>
      )}
      {(visible || !AvatarNode) && (
        <div
          className={cx(ss.main, {
            [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
            [ss.isTab]: isTab,
          })}
        >
          <BackArrow />
          <Avatar className={ss.avatar} name="user" image={defaultUserAvatar} size={46} />
          <div className={ss.name}>{defaultUserName}</div>
          <div className={ss.addressWarp}>
            <span className={ss.address}>{wallet_address}</span>
            <CopyIcon className={cx(ss.copyIcon, { [ss.copied]: copied })} onClick={copy} />
          </div>
          <OperaBar />
          <PlatformList />
          {hasLogout && (
            <div className={ss.logout} onClick={logout}>
              Logout
            </div>
          )}
        </div>
      )}
    </div>
  );
});
