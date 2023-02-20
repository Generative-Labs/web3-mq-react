import React, { useEffect, useState, useCallback, useRef } from 'react';
import cx from 'classnames';

import { Avatar } from '../Avatar';
import { Empty } from './Empty';
import { Button } from '../Button';
import { ChannelSelectItem as SearchBox, SearchItemProps } from './ChannelSelectItem';
import { Modal } from '../Modal';
import { Paginator } from '../Paginator';
import { SearchInput } from './SearchInput';

import { useChatContext, AppTypeEnum } from '../../context';
import { useSelectedContacts }  from './hooks/useSelectedContacts';
import { useSteps, StepTitleEnum } from './hooks/useSteps';
import { useSearchFollowContacts } from './hooks/useSearchFollowContacts';

import { AddUserIcon, CreateChannelIcon, CreateChatIcon, CloseBtnIcon, CheveronLeft } from '../../icons';

import { getShortAddress } from '../../utils';
import ss from './CreateChannel.scss';

type CreateChannelProps = {
  ChannelSelectItem?: React.ComponentType<SearchItemProps>;
};

const UnMemoizedCreateChannel = (props: CreateChannelProps) => {
  const { ChannelSelectItem = SearchBox } = props;
  const { client, appType, containerId, loginUserInfo, getUserInfo } = useChatContext();
  const { followContacts, searchFollowContacts, refreshing, getFollowContactsList, handleSearchFollContacts, setFollowContacts, loadNextPage } = useSearchFollowContacts(client, getUserInfo);
  const { contacts, selectedContacts, handleCleanSelected, handleDeleteContact, handleSelectedContact } = useSelectedContacts(followContacts);
  const { steps, current, handleNext, handlePrev, handleCleanSteps, handleUpdateSteps, setCurrent } = useSteps();
  const [ showCreateChannel, setShowCreateChannel ] = useState<boolean>(false);
  const [ isShowBackBtn, setIsShowBackBtn ] = useState<boolean>(false);
  const [ searchValue, setSearchValue ] = useState<string>('');
  const [ sendFriendAddress, setSendFriendAddress ] = useState<string>('');
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (steps.length) {
      setIsShowBackBtn(true);
    } else {
      setIsShowBackBtn(false);
    }
  }, [steps]);

  useEffect(() => {
    if (showCreateChannel) {
      getFollowContactsList();
    };
  }, [showCreateChannel]);
 
  const handleClose = useCallback(() => {
    setShowCreateChannel(false);
    setCurrent(0);
    setSendFriendAddress('');
    setSearchValue('');
    handleCleanSelected();
    handleCleanSteps();
  }, []);

  const handleBack = useCallback(() => {
    if (current === 0) {
      handleCleanSelected();
    };
    setSendFriendAddress('');
    handlePrev();
  }, [handlePrev]);

  const handleChange = useCallback((value) => {
    setSearchValue(value);
    handleSearchFollContacts(value);
  }, [handleSearchFollContacts]);

  const handleFollowOrSendFriend = useCallback(async ({
    userid, 
    address,
    follow_status
  }) => {
    if (follow_status === 'follow_each') return;
    if (follow_status === 'follower') {
      if (loginUserInfo) {
        await client.contact.followOperation({
          targetUserid: userid, 
          action: 'follow',
          address: loginUserInfo.address,
          didType: loginUserInfo.wallet_type as any
        });
        const _followContacts = followContacts.map(_followContact => {
          if (_followContact.userid === userid) {
            _followContact.follow_status = 'follow_each';
            return _followContact;
          };
          return _followContact;
        });
        setFollowContacts(_followContacts);
      }
    } else {
      setSendFriendAddress(address);
      handleUpdateSteps(StepTitleEnum['ADDFRIENDS']);
    }
  }, [followContacts, loginUserInfo]);

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
          <div ref={listRef} className={cx(ss.mainContainer, {[ss.hide]: !searchValue})}>
            { !searchFollowContacts.length ? <Empty content='No result' />
              : (
                <Paginator element={listRef} showLoading={refreshing} loadNextPage={loadNextPage}>
                  {searchFollowContacts.map(follow => (
                    <div className={ss.searchFollowerItem} key={follow.userid}>
                      <Avatar image={follow.avatar_url || follow.defaultUserAvatar} size={40} />
                      <div className={ss.wrapper}>
                        <div>{follow.nickname || follow.defaultUserName || getShortAddress(follow.wallet_address)}</div>
                        {(follow.follow_status === 'follower' || follow.follow_status === 'follow_each') && <div className={ss.followStatus}>follows you</div>}
                        {(follow.follow_status !== 'follower' && follow.follow_status !== 'follow_each') && <div className={ss.followStatus}>Not following you, send a friend request</div>}
                      </div>
                      <Button
                        className={ss.searchFollowersBtn} 
                        type='primary' 
                        disabled={follow.follow_status === 'follow_each'}
                        onClick={() => handleFollowOrSendFriend({
                          follow_status: follow.follow_status,
                          userid: follow.userid,
                          address: follow.wallet_address
                        })}
                      >
                        {follow.follow_status === 'follow_each' ? 
                          'Following' 
                          : 
                          follow.follow_status === 'follower' ? 
                            'Follow' 
                            :
                            'Request'
                        }
                      </Button>
                    </div>
                  ))}
                </Paginator>
              )
            }
          </div>
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
            disabled: sendFriendAddress && true, 
            userId: sendFriendAddress ? sendFriendAddress : undefined,
            onClose: handleClose,
            onSubmit: handleClose,
            onSelected: handleSelectedContact,
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