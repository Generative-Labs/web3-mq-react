import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { useMessageContext } from '../../../context/MessageContext';
import { dateTransform } from '../../../utils';

import ss from './index.scss';

export const NftItemCard: React.FC = () => {
  const { message } = useMessageContext('MessageInnerText');
  const { opensea_item_token_id, opensea_item_contract_address, opensea_item_name } = message;
  const [nftItemInfo, setNftItemInfo] = useState({
    name: '',
    creator: '',
  });

  const getNftInfo = async () => {
    if (opensea_item_token_id && opensea_item_contract_address) {
      const NFTData = await fetch(
        `https://api.opensea.io/api/v1/asset/${opensea_item_contract_address}/${opensea_item_token_id}/`,
      ).then((res) => res.json());
      if (NFTData) {
        setNftItemInfo({
          name: NFTData?.name || '',
          creator: NFTData?.creator?.user?.username || '',
        });
      }
    }
  };
  useEffect(() => {
    getNftInfo();
  }, []);

  return (
    <div className={ss.nftContainer}>
      <div className={ss.nftBox}>
        <img src={message.opensea_item_image_url || ''} alt="" />
        <div className={ss.nftInfo}>
          <div>{opensea_item_name || ''}</div>
          <div>
            <span>Created by </span>
            <span>{nftItemInfo.creator}</span>
          </div>
          <div>
            <span>Sale ends </span>
            <span>{dateTransform(Date.now() * 1000000)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
