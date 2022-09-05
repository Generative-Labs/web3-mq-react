import React, { useCallback } from 'react';
import { AssetDataTypeEnum, MsgContents, MsgContentsAssetData } from 'web2-mq';

import { useMessageContext } from '../../../context/MessageContext';
import { TransferIcon, EthLogoIcon } from '../../../icons';
import { getShortAddress } from '../../../utils';

import ss from './index.scss';

export const AssetDataTypeEnumMap = {
  [AssetDataTypeEnum.ERC20]: 'ERC20',
  [AssetDataTypeEnum.ERC721]: 'ERC721',
  [AssetDataTypeEnum.ERC1155]: 'ERC1155',
};

export const SudoSwapCard: React.FC = React.memo(() => {
  const { message } = useMessageContext('MessageInnerText');
  const { asset1Data, asset2Data, jumpUrl, expiryDate, recipientAddress, creatorAddress } =
    message.msg_contents as MsgContents;

  const handleJump = useCallback(() => {
    window.open(jumpUrl, '_blank');
  }, []);

  const NFTCard = useCallback((props: { data: MsgContentsAssetData[] }) => {
    const { data = [] } = props;
    const { imgURL = '', type = '1', name = '', id = '', amount = '' } = data[0] || {};
    const len = data.length - 1;

    return (
      <div>
        <div className={ss.cardItem}>
          {type === AssetDataTypeEnum.ERC20 || imgURL === '' ? (
            <EthLogoIcon className={ss.icon} />
          ) : (
            <img className={ss.icon} src={imgURL} />
          )}
          <div className={ss.desc}>
            <b className={ss.name}>{name}</b>
            {id && (
              <div className={ss.id}>
                <b>ID: </b>
                <span>{id}</span>
              </div>
            )}
            <div className={ss.amount}>
              <b>Amount: </b>
              <span>{amount}</span>
            </div>
            <div className={ss.type}>
              <b>Type: </b>
              <span>{AssetDataTypeEnumMap[type]}</span>
            </div>
          </div>
        </div>
        {len > 0 && <div className={ss.more} onClick={handleJump}>{`${len} more...`}</div>}
      </div>
    );
  }, []);

  return (
    <div className={ss.sudoSwapCardContainer}>
      <div className={ss.warp}>
        <div className={ss.titleContainer}>
          <img src="https://sudoswap.xyz/assets/vaporwave/logo.png" alt="" />
          <div>SudoSwap</div>
        </div>
        <div className={ss.cardContainer}>
          <NFTCard data={asset1Data} />
          <TransferIcon className={ss.transferIcon} />
          <NFTCard data={asset2Data} />
        </div>
        <div className={ss.info}>
          <span>Initiator</span>
          <b>{getShortAddress(creatorAddress)}</b>
        </div>
        <div className={ss.info}>
          <span>Recipient</span>
          <b>{expiryDate}</b>
        </div>
        <div className={ss.info}>
          <span>Expires on</span>
          <b>{recipientAddress !== '' ? getShortAddress(recipientAddress) : 'AnyOne'}</b>
        </div>
        <div className={ss.btn} onClick={handleJump}>
          Go to Sudoswap
        </div>
      </div>
    </div>
  );
});
