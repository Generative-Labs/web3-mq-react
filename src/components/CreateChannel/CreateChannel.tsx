import React, { useEffect, useState, useCallback } from 'react';
import cx from 'classnames';

import { Avatar } from '../Avatar';
import { Empty } from './Empty';
import { Button } from '../Button';
import { ChannelSelectItem as SearchBox, SearchItemProps } from './ChannelSelectItem';
import { Modal } from '../Modal';
import { SearchInput } from './SearchInput';

import { useChatContext, AppTypeEnum } from '../../context';
import { useSelectedContacts }  from './hooks/useSelectedContacts';
import { useSteps, StepTitleEnum } from './hooks/useSteps';
import { useSearchFollower } from './hooks/useSearchFollower';

import { AddUserIcon, CreateChannelIcon, CreateChatIcon, CloseBtnIcon, CheveronLeft } from '../../icons';

import { getShortAddress } from '../../utils';
import ss from './CreateChannel.scss';

type CreateChannelProps = {
  ChannelSelectItem?: React.ComponentType<SearchItemProps>;
};

const UnMemoizedCreateChannel = (props: CreateChannelProps) => {
  const { ChannelSelectItem = SearchBox } = props;
  const { client, appType, containerId, loginUserInfo } = useChatContext();
  const { contacts, selectedContacts, handleCleanSelected, handleEvent, handleDeleteContact, handleSelectedContact } = useSelectedContacts(client);
  const { steps, current, handleNext, handlePrev, handleCleanSteps, handleUpdateSteps, setCurrent } = useSteps();
  const { followers, searchFollowers, getFollowerList, handleSearchFollers, setFollowers } = useSearchFollower(client);
  const [ showCreateChannel, setShowCreateChannel ] = useState<boolean>(false);
  const [ isShowBackBtn, setIsShowBackBtn ] = useState<boolean>(false);
  const [ searchValue, setSearchValue ] = useState<string>('');

  useEffect(() => {
    client.on('contact.getContactList', handleEvent);
    client.on('contact.updateContactList', handleEvent);
    client.on('channel.activeChange', handleEvent);
    return () => {
      client.off('contact.getContactList', handleEvent);
      client.off('contact.updateContactList', handleEvent);
      client.off('channel.activeChange', handleEvent);
    };
  }, []);

  useEffect(() => {
    if (steps.length) {
      setIsShowBackBtn(true);
    } else {
      setIsShowBackBtn(false);
    }
  }, [steps]);

  useEffect(() => {
    if (showCreateChannel) {
      getFollowerList();
    };
  }, [showCreateChannel]);
 
  const handleClose = useCallback(() => {
    setShowCreateChannel(false);
    setCurrent(0);
    setSearchValue('');
    handleCleanSelected();
    handleCleanSteps();
  }, []);

  const handleBack = useCallback(() => {
    if (current === 0) {
      handleCleanSelected();
    };
    handlePrev();
  }, [handlePrev]);

  const handleChange = useCallback((value: any) => {
    setSearchValue(value);
    handleSearchFollers(value);
  }, [handleSearchFollers]);

  const handleFollowOrSendFriend = useCallback(async (userid: any, action: 'follow') => {
    if (action === 'follow') {
      if (loginUserInfo) {
        await client.contact.followOperation({
          targetUserid: userid, 
          action: 'follow',
          address: loginUserInfo.address,
          didType: loginUserInfo.wallet_type as any
        });
        const _followers = followers.map(_follower => {
          if (_follower.userid === userid) {
            _follower.follow_status = 'follow_each';
            return _follower;
          };
          return _follower;
        });
        setFollowers(_followers);
      }
    }
    
  }, [followers, loginUserInfo]);

  const startChat = (userid: string) => {
    const { channelList } = client.channel;
    if (channelList) {
      const activeChannel = channelList.find((channel: any) => channel.chatid === userid);
      if (activeChannel) {
        client.channel.setActiveChannel(activeChannel || null);
        setShowCreateChannel(false);
      }
    }
  };

  const ModalHead = useCallback(
    () => (
      <div className={ss.createChannelModalHeader}>
        {isShowBackBtn && <CheveronLeft onClick={handleBack} className={ss.backBtn} />}
        <div className={ss.title}>{!steps.length ? 'New Message' : steps[current].title}</div>
        <CloseBtnIcon onClick={handleClose} className={ss.closeBtn} />
      </div>
    ),
    [current, isShowBackBtn, handleBack, steps],
  );
  
  const FollowerList = useCallback(() => (
    <div className={cx(ss.mainContainer, {[ss.hide]: !searchValue})}>
      { !searchFollowers.length ? <Empty content='No result' />
        : (
          searchFollowers.map(follower => (
            <div className={ss.searchFollowerItem} key={follower.userid}>
              <Avatar image={follower.avatar_url} size={40} />
              <div className={ss.wrapper}>
                <div>{follower.nickname || getShortAddress(follower.wallet_address)}</div>
                <div className={ss.followStatus}>follows you</div>
              </div>
              <Button
                className={ss.searchFollowersBtn} 
                type='primary' 
                disabled={follower.follow_status === 'follow_each'}
                onClick={() => handleFollowOrSendFriend(follower.userid, 'follow')}
              >
                {follower.follow_status !== 'follow_each' ? 'Follow' : 'Following'}
              </Button>
            </div>
          ))
        )
      }
    </div>
  ), [searchValue, searchFollowers, handleFollowOrSendFriend]);

  const OperaBar = useCallback(
    () => (
      <div className={cx(ss.opreraBar, {
        [ss.hide]: searchValue
      })}>
        <Button block icon={<AddUserIcon className={ss.addFriends} /> } size='large' type='ghost' onClick={() => handleUpdateSteps(StepTitleEnum['ADDFRIENDS'])}>Add friends</Button>
        <Button block icon={<CreateChatIcon className={ss.createRoom} />} size='large' type='ghost' onClick={() => handleUpdateSteps(StepTitleEnum['CREATEROOM'])}>Create room</Button>
      </div>
    ),
    [searchValue]
  );

  return (
    <>
      <button
        className={ss.btn}
        onClick={() => {
          setShowCreateChannel(!showCreateChannel);
        }}
      >
        <CreateChannelIcon />
      </button>
      <Modal
        appType={appType}
        containerId={containerId}
        visible={showCreateChannel}
        dialogClassName={cx(ss.createChannelModal, {[ss.mobileStyle]: appType !== AppTypeEnum['pc'] })}
        modalHeader={<ModalHead />}
        closeModal={handleClose}
      >
        <div className={cx(ss.createChannelContainer, {
          [ss.hide]: steps.length
        })}>
          <SearchInput style={{margin: '0px 16px'}} value={searchValue} onChange={handleChange} />
          <FollowerList />
          <OperaBar />
          <div className={cx(ss.contactsContainer, {
            [ss.hide]: searchValue
          })}>
            <div className={ss.friendTitle}>Friends</div>
            { contacts.length ? (
              <div className={ss.contactList}>
                {contacts.map((contact: any) => {
                  return (
                    <div className={ss.contactItem} key={contact.userid} onClick={() => startChat(contact.userid)}>
                      <Avatar image={contact.avatar_url || contact.defaultUserAvatar} size={40} />
                      <div className={ss.wrapper}>
                        {contact.nickname || contact.defaultUserName || getShortAddress(contact.userid)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : <Empty content='no friends' style={{height: 'calc(100% - 28px)'}} />}
          </div>
        </div>
        {steps.map((step, index) => {
          const { Component } = step;
          const props = {
            key: step.id,
            className: cx({ [ss.hide]: index !== current }),
            client,
            contactList: contacts,
            selectedContacts,
            onClose: handleClose,
            onSubmit: handleClose,
            onSelected: handleSelectedContact,
            needRequire: false,
            onDeleted: handleDeleteContact,
            handleNext,
          };
          return <Component { ...props }  />;
        })}
      </Modal>
    </>
    
  );
};
export const CreateChannel = React.memo(UnMemoizedCreateChannel);