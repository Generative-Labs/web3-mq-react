import React, { useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import type { EventTypes } from '@web3mq/client';

import LoadingPng from './loading.png';

import { Button } from '../Button';
import { Modal } from '../Modal';
import { useChatContext } from '../../context/ChatContext';
import useToggle from '../../hooks/useToggle';
import { ConnectClosedIcon, SuccessIcon } from '../../icons';

import ss from './index.scss';

export type ConnectMessageProps = {
  btnNode?: React.ReactNode;
  connectDescription?: string | React.ReactNode;
  connectIcon?: React.ReactNode; 
  closedDescription?: string | React.ReactNode;
  closedIcon?: React.ReactNode; 
  openDescription?: string | React.ReactNode;
  openIcon?: React.ReactNode; 
  isShow?: boolean;
};
let timeId: NodeJS.Timeout | null = null;
let initTimeId: NodeJS.Timeout | null = null;

export const ConnectMessage: React.FC<ConnectMessageProps> = (props) => {
  const {
    btnNode,
    connectDescription,
    connectIcon,
    closedDescription,
    closedIcon,
    openDescription,
    openIcon, 
    isShow = true,
  } = props;
  const { client, containerId } = useChatContext();
  const { visible, show, hide } = useToggle(isShow);
  const [status, setStatus] = useState<number>(client.connect.ws?.readyState || 0);
  const defaultDescription = useMemo(() => {
    return status === 0 
      ? 
      (connectDescription || 'Connecting') 
      :
      status === 1
        ?
        (openDescription || 'Connection successful')
        :
        status === 3
          ?
          (closedDescription || 'connection is broken')
          :
          '';
  }, [status]);

  const handleEvent = (props: { type: EventTypes }) => {
    const { type } = props;
    const { ws } = client.connect;
    if (type === 'connect.changeReadyStatus') {
      show();
      if (ws?.readyState === 1) {
        timeId && clearTimeout(timeId);
        timeId = setTimeout(() => {
          hide();
        }, 1000);
      }
      setStatus(ws?.readyState || 0);
    }
  };
  const handleReconnect = () => {
    setStatus(0);
    client.connect.init();
  };

  const initRender = () => {
    const { ws } = client.connect;
    if (ws) {
      setStatus(ws.readyState);
      if (ws.readyState == 1) {
        initTimeId && clearTimeout(initTimeId);
        initTimeId = setTimeout(() => {
          hide();
        }, 1000);
      }
    }
  };

  useEffect(() => {
    initRender();
    client.on('connect.changeReadyStatus', handleEvent);
    return () => {
      client.off('connect.changeReadyStatus', handleEvent);
    };
  }, []);

  return (
    <Modal
      visible={visible}
      containerId={containerId}
      dialogClassName={ss.modalContent}
      modalHeader={<div style={{display: 'none'}}/>}
      closeModal={status === 3 ? hide : () => {}}
    >
      <>
        <div className={cx(ss.iconBox)}>
          {status === 0 ? 
            (connectIcon || <img 
              className={cx(ss.roate)} 
              src={LoadingPng} 
              alt="" 
            />)
            :
            status === 1
              ?
              (openIcon ||  <SuccessIcon />)
              :
              status === 3
                ?
                (closedIcon || <ConnectClosedIcon />)
                : 
                null
          }
        </div>
        <div className={ss.description}>{defaultDescription}</div>
        {status === 3 && (btnNode || <Button onClick={handleReconnect} type='ghost' style={{marginTop: '12px'}}>Reconnect</Button>)}
      </>
    </Modal>
  );
};