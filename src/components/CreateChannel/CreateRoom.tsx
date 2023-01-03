import React, { useEffect, useState, useRef } from 'react';
import cx from 'classnames';
import type { Client } from 'web3-mq';

import { Avatar } from '../Avatar';
import { MqButton } from '../MqButton';

import { CameraIcon } from '../../icons';

import { getShortAddress, fileParse } from '../../utils';

import ss from './CreateChannel.scss';

type CreateRoomProps = {
  className?: string;
  client: Client;
  selectedContacts: Array<any>;
  onClose?: () => void;
}
export const CreateRoom: React.FC<CreateRoomProps> = (props) => {
  const { className, client, selectedContacts, onClose } = props;
  const [ selectFileUrl, setSelectFileUrl ] = useState<string>('');
  const [ roomName, setRoomName ] = useState<string>('');
  const [ btnLoad, setBtnLoad ] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEvent = () => {};
  useEffect(() => {
    client.on('channel.getList', handleEvent);
    client.on('channel.activeChange', handleEvent);

    return () => {
      client.off('channel.getList', handleEvent);
      client.off('channel.activeChange', handleEvent);
    };
  }, []);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    };
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const file = files[0];
    const data = await fileParse(file);
    setSelectFileUrl(data.target.result);
  };

  const handleSubmit = async () => {
    try {
      setBtnLoad(true);
      // create room
      await client.channel.createRoom({group_name: roomName, avatar_base64: selectFileUrl});
      // set room to active
      const { channelList } = client.channel;
      if (channelList) {
        await client.channel.setActiveChannel(channelList[0]);
        const selected = selectedContacts.map(item => item.userid);
        // invite contact
        await client.channel.inviteGroupMember(selected);
      }
      setBtnLoad(false);
      onClose && onClose();
    } catch (error) {
      onClose && onClose();
      setBtnLoad(false);
    }
  };

  return (
    <div className={cx(ss.createRoomContainer, className)}>
      <div className={ss.operationContainer}>
        <div className={cx(ss.fileBox, {[ss.nopadding]: selectFileUrl})} onClick={handleClick}>
          { selectFileUrl ? (
            <div className={ss.imgBox}><img style={{height: '100%', width: '100%'}} src={selectFileUrl} alt="" /></div>
          ) : (
            <CameraIcon className={ss.cameraIcon} />
          )}
          <input 
            ref={fileInputRef}
            style={{display: 'none'}} 
            type='file'
            onChange={handleFileChange}
          />
        </div>
        <input 
          className={ss.commonInput}
          placeholder='Room name' 
          value={roomName} 
          type='text' 
          onChange={(e) => { setRoomName(e.target.value)}} 
        />
      </div>
      <div className={ss.mainContainer}>
        { selectedContacts.map(contact => (
          <label key={contact.userid} className={ss.searchContactItem}>
            <Avatar image={contact.avatar_url} size={40} />
            <div className={ss.wrapper}>
              {contact.nickname ||  getShortAddress(contact.userid)}
            </div>
          </label>
        ))}
      </div>
      <div className={cx(ss.btnContaner)}>
        <MqButton 
          block  
          disabled={!selectFileUrl || !roomName || btnLoad} 
          size='large' 
          type='primary' 
          onClick={handleSubmit}
        >Create</MqButton>
      </div>
    </div>
  );
};