import React, { PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react';
import cx from 'classnames';

import {
  ArrowLeft,
  CopyIcon,
  MessageIcon,
  AddContactIcon,
  CheveronLeft,
  CloseBtnIcon,
  // TwitterIcon,
  // OpenseaIcon,
  // DiscordIcon,
} from '../../icons';
import { Avatar } from '../Avatar';
import type { UserInfoType } from '../Chat/hooks/useQueryUserInfo';
import { copyText } from '../../utils';
import useToggle from '../../hooks/useToggle';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { toast } from '../Toast';

import ss from './index.scss';
import { Modal } from '../Modal';

type IProps = {
  userInfo?: UserInfoType;
  isShow?: boolean;
  isSelf?: boolean;
  isTab?: boolean;
};

export const Profile = React.memo((props: PropsWithChildren<IProps>) => {
  const { userInfo: propsUserInfo, isSelf = false, isShow = false } = props;
  const { client, userInfo: contextUserInfo, appType, containerId } = useChatContext('Profile');
  const [copied, setCopied] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const { visible, toggle, hide } = useToggle(isShow);

  const userInfo = propsUserInfo || contextUserInfo;
  const { defaultUserAvatar = '', defaultUserName = '' } = userInfo || {};

  const { avatar_url = '', nickname = '', wallet_address = '' } = userInfo?.web3mqInfo || {};

  const copy = useCallback(async () => {
    const res = await copyText(wallet_address);
    setCopied(res);
    setTimeout(() => {
      setCopied(false);
    }, 800);
  }, [wallet_address]);

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

  const OperaBar = useCallback(() => {
    if (isSelf) {
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
  }, [isShow]);

  const PlatformList = useCallback(() => {
    return (
      <div className={ss.platformContainer}>
        <div className={ss.title}>Accounts linked to my SwapChat</div>
      </div>
    );
  }, []);

  const BackArrow = useCallback(() => {
    return <ArrowLeft className={ss.back} onClick={hide} />;
  }, []);

  const ProfileContent = useCallback(() => {
    return (
      <div
        className={cx(ss.main, {
          [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
          [ss.isTab]: appType !== AppTypeEnum['pc'],
        })}
      >
        <BackArrow />
        <Avatar
          className={ss.avatar}
          name="user"
          image={avatar_url || defaultUserAvatar}
          size={46}
        />
        <div className={ss.name}>{nickname || defaultUserName}</div>
        <div className={ss.addressWarp}>
          <span className={ss.address}>{wallet_address}</span>
          <CopyIcon className={cx(ss.copyIcon, { [ss.copied]: copied })} onClick={copy} />
        </div>
        <OperaBar />
        <PlatformList />
      </div>
    );
  }, []);
  const handleBack = () => {};

  const handleClose = () => {
    hide();
  };

  const ModalHead = useCallback(
    () => (
      <div className={ss.createChannelModalHeader}>
        <CheveronLeft onClick={handleBack} className={ss.backBtn} />
        <div className={ss.title}>Profile</div>
        <CloseBtnIcon onClick={handleClose} className={ss.closeBtn} />
      </div>
    ),
    [handleBack],
  );

  return (
    <div
      className={cx(ss.profileContainer, {
        [ss.isRelative]: appType === AppTypeEnum['pc'],
      })}
    >
      ref={selectRef}
      {appType === AppTypeEnum['pc'] ? (
        <Modal
          appType={appType}
          containerId={containerId}
          visible={visible}
          closeModal={hide}
          modalHeader={<ModalHead />}
        >
          <ProfileContent />
        </Modal>
      ) : (
        <div className={ss.mobileStyle}>
          <ProfileContent />
        </div>
      )}
    </div>
  );
});
