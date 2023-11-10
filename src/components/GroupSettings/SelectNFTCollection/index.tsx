import React, { ReactNode, useMemo, useState } from 'react';
import { GroupSettingsModalTypeEnum } from '../GroupSettings';
import { useChannelStateContext, useChatContext } from '../../../context';
import { ExclamationCircleIcon, StarkNetworkIcon } from '../../../icons';
import { Button } from '../../Button';
import cx from 'classnames';
import Select from 'react-select';
import { number } from 'starknet';
import ss from './index.scss';


type IProps = {
  className?: string;
  style?: React.CSSProperties;
  handleModalTypeChange: (type?: GroupSettingsModalTypeEnum) => void;
  handleSetMsgChange: (msg: string) => void;
};

enum GroupPermissionTypeEnum {
  Public,
  Invite,
  NFT,
}

const groupPermissionMaps = {
  [GroupPermissionTypeEnum.NFT]: 'nft_validation',
  [GroupPermissionTypeEnum.Public]: 'public',
  [GroupPermissionTypeEnum.Invite]: 'creator_invite_friends',
};

type chainType = 'evm' | 'starknet';
type optionType = {
  value: chainType;
  key: chainType;
  label: ReactNode;
};

export const SelectNFTCollection: React.FC<IProps> = (props) => {
  const { handleModalTypeChange, handleSetMsgChange, className } = props;
  const { activeChannel } = useChannelStateContext('MessageHeader');
  const { client } = useChatContext('MessageHeader');
  const [errorMsg, setErrorMsg] = useState('');
  const [load, setLoad] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');
  const [selectNetwork, setSelectNetwork] = useState<chainType>('starknet');
  const [selectChainId, setSelectChainId] = useState('SN_GOERLI');

  const options: optionType[] = [
    // {
    //   value: 'evm',
    //   key: 'evm',
    //   label: (
    //     <div className={ss.optionItem}>
    //       <div className={ss.leftBox}>
    //         <div className={ss.left}>{<EthNetworkIcon />}</div>
    //         <div className={ss.text}>Ethereum</div>
    //       </div>
    //       <div className={ss.right}>{/*{item.value === selected?.value && <SelectedIcon />}*/}</div>
    //     </div>
    //   ),
    // },
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

  const chainIdOptions = useMemo(() => {
    const config = {
      evm: [
        {
          label: 'SN_GOERLI',
          value: 'SN_GOERLI',
          key: 'SN_GOERLI',
        },
      ],
      starknet: [
        {
          label: (
            <div className={ss.optionItem}>
              <div className={ss.leftBox}>
                {/*<div className={ss.left}>{<StarkNetworkIcon />}</div>*/}
                <div className={ss.text}>SN_GOERLI</div>
              </div>
              <div className={ss.right}>
                {/*{item.value === selected?.value && <SelectedIcon />}*/}
              </div>
            </div>
          ),
          value: 'SN_GOERLI',
          key: 'SN_GOERLI',
        },
      ],
    };
    console.log(config[selectNetwork], 'config[selectNetwork]');
    return config[selectNetwork];
  }, [selectNetwork]);

  const handleSubmit = async () => {
    try {
      setLoad(true);
      let starkNetAddress = number.cleanHex(value);
      const updateRes = await client.channel.updateGroupPermissions({
        groupid: activeChannel.chatid,
        nfts: [
          {
            chain_id: selectChainId,
            chain_type: selectNetwork,
            contract: value.toLowerCase(),
          },
        ],
        permissions: {
          'group:join': {
            type: 'enum',
            value: 'nft_validation',
          },
        },
      });
      console.log(updateRes, 'updateRes');
      setLoad(false);
      handleModalTypeChange(GroupSettingsModalTypeEnum.Success);
    } catch (error: any) {
      console.log(error, 'error');
      console.log(error.message, 'error.message');
      setErrorMsg(error.message);
      setLoad(false);
    }
  };

  const disabled = useMemo(() => {
    return !value || !value.startsWith('0x') || !!errorMsg || load;
  }, [value, errorMsg, load]);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (!e.target.value.toLowerCase().startsWith('0x')) {
      setErrorMsg('Please enter the correct contract address');
    } else {
      setErrorMsg('');
    }
  };

  const handleTypeChange = (item: any) => {
    setSelectNetwork(item.value);
    setErrorMsg('');
  };

  const handleChainIdChange = (item: any) => {
    setSelectChainId(item.value);
    setErrorMsg('');
  };

  return (
    <div className={cx(ss.selectNFTCollectionContainer, className)}>
      <div className={ss.label}>Chain Type</div>
      <Select
        className={'selectContainer'}
        classNamePrefix="react-select"
        options={options}
        onChange={handleTypeChange}
        defaultValue={options[0]}
      />
      <div className={ss.label}>Chain ID</div>
      <Select
        className={'selectContainer'}
        classNamePrefix="react-select"
        options={chainIdOptions}
        onChange={handleChainIdChange}
        defaultValue={chainIdOptions[0]}
      />
      <div className={ss.label}>NFT Contract Address</div>
      <textarea
        className={ss.commonTextarea}
        maxLength={100}
        value={value}
        onChange={(e) => handleChange(e)}
      />
      {errorMsg && (
        <div className={ss.warnning}>
          <ExclamationCircleIcon className={ss.warnIcon} />
          {errorMsg}
        </div>
      )}
      <div className={ss.submitBtnBox}>
        <Button
          disabled={disabled}
          className={ss.submitBtn}
          type={'primary'}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </div>
    </div>
  );
};
