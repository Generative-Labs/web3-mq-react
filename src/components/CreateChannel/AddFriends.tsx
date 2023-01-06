import React, { useState } from 'react';
import cx from 'classnames';
import type { Client } from 'web3-mq';

import { Button } from '../Button';
import { ExclamationCircleIcon } from '../../icons';

import ss from './CreateChannel.scss';

type AddFriendsProps = {
  className?: string;
  client: Client;
  onClose?: () => void;
}
export const AddFriends: React.FC<AddFriendsProps> = (props) => {
  const { className, client, onClose } = props;
  const [ value, setValue ] = useState<string>('');
  const [ content, setContent ] = useState<string>('');
  const [ isWarn, setIsWarn ] = useState<boolean>(false);
  const [ load, setLoad ] = useState<boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value.indexOf('user:') !== 0) {
      setIsWarn(true);
    } else {
      setIsWarn(false);
    }
  };
  const handleSubmit = async () => {
    try {
      setLoad(true);
      await client.contact.sendFriend(value, content);
      setLoad(false);
      onClose && onClose();
    } catch (error) {
      setIsWarn(true);
      setLoad(false);
    }
  };

  return (
    <>
      <div className={cx(ss.addFriendContainer, className)}>
        <div className={ss.label}>User ID</div>
        <input className={ss.commonInput} type='text' value={value} onChange={(e) => handleChange(e)} />
        <div className={cx(ss.warnning, {
          [ss.hide]: !isWarn
        })}>
          <ExclamationCircleIcon className={ss.warnIcon} />ID invalid, please check whether the input is correct
        </div>
        <div className={ss.label}>Add invitation note</div>
        <textarea className={ss.commonTextarea} maxLength={100} value={content} onChange={(e) => { setContent(e.target.value)}} />
        <div className={cx(ss.btnContaner)}>
          <Button block disabled={!value || isWarn || load} size='large' type='primary' onClick={handleSubmit}>Add</Button>
        </div>
      </div>
    </>
  );
};