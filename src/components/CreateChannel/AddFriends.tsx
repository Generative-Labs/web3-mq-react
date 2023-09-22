import React, { ReactNode, useState } from 'react';
import cx from 'classnames';
import type { Client, BlockChainType } from '@web3mq/client';

import { Button } from '../Button';
import { ExclamationCircleIcon, EthNetworkIcon, StarkNetworkIcon } from '../../icons';
import Select from 'react-select';

import ss from './CreateChannel.scss';
import { number } from 'starknet';

type AddFriendsProps = {
  className?: string;
  client: Client;
  disabled?: boolean;
  userId?: string;
  onSubmit?: () => void;
};

type optionType = {
  value: BlockChainType;
  key: BlockChainType;
  label: ReactNode;
};
export const AddFriends: React.FC<AddFriendsProps> = (props) => {
  const { className, client, disabled = false, userId = '', onSubmit } = props;
  const [value, setValue] = useState<string>(userId);
  const [content, setContent] = useState<string>('');
  const [isWarn, setIsWarn] = useState<boolean>(false);
  const [load, setLoad] = useState<boolean>(false);
  const [selectNetwork, setSelectNetwork] = useState<BlockChainType>('eth');
  const options: optionType[] = [
    {
      value: 'eth',
      key: 'eth',
      label: (
        <div className={ss.optionItem}>
          <div className={ss.leftBox}>
            <div className={ss.left}>{<EthNetworkIcon />}</div>
            <div className={ss.text}>Ethereum</div>
          </div>
          <div className={ss.right}>{/*{item.value === selected?.value && <SelectedIcon />}*/}</div>
        </div>
      ),
    },
    {
      value: 'starknet',
      key: 'starknet',
      label: (
        <div className={ss.optionItem}>
          <div className={ss.leftBox}>
            <div className={ss.left}>{<StarkNetworkIcon />}</div>
            <div className={ss.text}>Starknet</div>
          </div>
          <div className={ss.right}>{/*{item.value === selected?.value && <SelectedIcon />}*/}</div>
        </div>
      ),
    },
  ];
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (!e.target.value.toLowerCase().startsWith('0x') && e.target.value.indexOf('user:') !== 0) {
      setIsWarn(true);
    } else {
      setIsWarn(false);
    }
  };
  const handleSubmit = async () => {
    try {
      setLoad(true);
      let starkNetAddress = number.cleanHex(value);
      await client.contact.sendFriend(starkNetAddress.toLowerCase(), content, selectNetwork);
      setLoad(false);
      onSubmit && onSubmit();
    } catch (error) {
      setIsWarn(true);
      setLoad(false);
    }
  };
  const handleTypeChange = (item: any) => {
    setSelectNetwork(item.value);
  };

  return (
    <>
      <div className={cx(ss.addFriendContainer, className)}>
        <div className={ss.label}>Network</div>
        <Select
          className={'selectContainer'}
          classNamePrefix="react-select"
          options={options}
          onChange={handleTypeChange}
          defaultValue={options[0]}
        />
        <div className={ss.label}>Address/User ID</div>
        <input
          className={ss.commonInput}
          disabled={disabled}
          type="text"
          value={value}
          onChange={(e) => handleChange(e)}
        />
        <div
          className={cx(ss.warnning, {
            [ss.hide]: !isWarn,
          })}
        >
          <ExclamationCircleIcon className={ss.warnIcon} />
          ID invalid, please check whether the input is correct
        </div>
        <div className={ss.label}>Add invitation note</div>
        <textarea
          className={ss.commonTextarea}
          maxLength={100}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
          }}
        />
        <div className={cx(ss.btnContaner)}>
          <Button
            block
            disabled={!value || !content || isWarn || load}
            size="large"
            type="primary"
            onClick={handleSubmit}
          >
            Add
          </Button>
        </div>
      </div>
    </>
  );
};
