import React, { useCallback, useEffect, useMemo, useState } from 'react';

import ss from './index.scss';
import type { GroupPermissionValueType } from '@web3mq/client';
import type { GroupSettingsModalTypeEnum } from '../GroupSettings';
import { useChannelStateContext, useChatContext } from '../../../context';
import { SelectRadioTrueIcon } from '../../../icons';
import { Button } from '../../Button';
import { Loading } from '../../Loading';

type MembersType = any;

type IProps = {
  className?: string;
  style?: React.CSSProperties;
  handleModalTypeChange: (type?: GroupSettingsModalTypeEnum) => void;
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

export const GroupManage: React.FC<IProps> = (props) => {
  const { handleModalTypeChange } = props;
  const { activeChannel } = useChannelStateContext('MessageHeader');
  console.log(activeChannel, 'activeChannel');
  const [isFocus, setIsFocus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectItem, setSelectItem] = useState<GroupPermissionTypeEnum>();
  const { appType, client, containerId } = useChatContext('MessageHeader');

  const listConfig = useMemo(() => {
    return [
      {
        title: 'Public group',
        desc: 'Anyone can join this group',
        value: GroupPermissionTypeEnum.Public,
      },
      {
        title: 'Creator Invitation Only',
        desc: 'Only friends invited by the creator can access the group',
        value: GroupPermissionTypeEnum.Invite,
      },
      {
        title: 'Holding specific NFG Collection',
        desc: 'Only users with a specific NFT collection can join the group',
        value: GroupPermissionTypeEnum.NFT,
      },
    ];
  }, [activeChannel]);
  const getGroupPermission = async () => {
    setLoading(true);
    const res = await client.channel.getGroupPermissions(activeChannel.chatid);
    setLoading(false);
    if (res.data && res.data.permissions) {
      if (
        Object.keys(res.data.permissions).includes('group:join') &&
        res.data.permissions['group:join'].value
      ) {
        if (res.data.permissions['group:join'].value === 'creator_invite_friends') {
          setSelectItem(GroupPermissionTypeEnum.Invite);
        } else if (res.data.permissions['group:join'].value === 'nft_validation') {
          setSelectItem(GroupPermissionTypeEnum.NFT);
        } else {
          setSelectItem(GroupPermissionTypeEnum.Public);
        }
      } else {
        setSelectItem(GroupPermissionTypeEnum.Public);
      }
    } else {
      setSelectItem(GroupPermissionTypeEnum.Public);
    }
    console.log(res.data.permissions, 'res');
  };
  useEffect(() => {
    getGroupPermission();
  }, []);

  const handleSubmit = async () => {
    if (selectItem === GroupPermissionTypeEnum.NFT) {
      //
      // handleModalTypeChange();
    } else {
      const res = await client.channel.updateGroupPermissions({
        groupid: activeChannel.chatid,
        permissions: {
          'group:join': {
            type: 'enum',
            value: selectItem ? groupPermissionMaps[selectItem]  as GroupPermissionValueType: 'public',
          },
        },
      });
      handleModalTypeChange();
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className={ss.groupManageBox}>
          <div className={ss.title}>Who can join this group</div>
          <div className={ss.list}>
            {listConfig.map((item, index) => {
              return (
                <div
                  className={ss.itemBox}
                  key={index}
                  onClick={() => {
                    setSelectItem(item.value);
                  }}
                >
                  <div className={ss.left}>
                    {selectItem === item.value ? (
                      <SelectRadioTrueIcon />
                    ) : (
                      <div className={ss.selectDefaultBox}></div>
                    )}
                  </div>
                  <div className={ss.right}>
                    <div className={ss.up}>{item.title}</div>
                    <div className={ss.down}>{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={ss.submitBtnBox}>
            <Button className={ss.submitBtn} type={'primary'} onClick={handleSubmit}>
              {selectItem === GroupPermissionTypeEnum.NFT ? 'Next' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
