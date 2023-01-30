import React, {
  PropsWithChildren,
  useReducer,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import type { EventTypes } from '@web3mq/client';
import cx from 'classnames';

import {
  ChannelStateProvider,
  ChannelStateContextValue,
  MessageItem,
} from '../../context/ChannelStateContext';
import {
  ChannelActionProvider,
  ChannelActionContextValue,
} from '../../context/ChannelActionContext';
import { ComponentProvider, ComponentContextValue } from '../../context/ComponentContext';
import { useChatContext, AppTypeEnum } from '../../context/ChatContext';
import { channelReducer, ChannelStateReducer, initialState } from './ChannelState';

import { MessageSimple } from '../Message/MessageSimple';
import { MessageInputFlat } from '../MessageInput/MessageInputFlat';
import { ThreadHeader as DefaultThreadHeader } from '../Thread/ThreadHeader';

import ss from './index.scss';

export type ChannelProps = {
  className?: string;
  Message?: ComponentContextValue['Message'];
  Input?: ComponentContextValue['Input'];
  ThreadHeader?: ComponentContextValue['ThreadHeader'];
};

export const Channel = (props: PropsWithChildren<ChannelProps>) => {
  const { children, className } = props;
  const currentState = useRef(initialState);
  const [state, dispatch] = useReducer<ChannelStateReducer>(channelReducer, initialState);
  const { client, appType } = useChatContext('Message');
  const { activeChannel } = state;
  currentState.current = state;

  const handleEvent = useCallback((event: { type: EventTypes; data?: any }) => {
    const { type } = event;
    if (type === 'channel.activeChange' || type === 'contact.activeChange') {
      dispatch({ type: 'setActiveChannel', activeChannel: client.channel.activeChannel });
      closeThread();
      closeAllThreadList();
    }
  }, []);

  useEffect(() => {
    client.on('channel.activeChange', handleEvent);
    client.on('contact.activeChange', handleEvent);
    return () => {
      client.off('channel.activeChange');
      client.off('contact.activeChange');
    };
  }, []);

  const handleOpenThread = async (message: MessageItem, event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    if (currentState.current.message?.id === message.id) {
      return;
    }
    dispatch({ type: 'openThread', message });
    dispatch({ type: 'setThreadLoading', threadLoading: true });
    // await client.messages.openThread(message);
    dispatch({ type: 'setThreadLoading', threadLoading: false });
  };

  const handleToReply = async (message: MessageItem, event: React.BaseSyntheticEvent) => {
    event.preventDefault();
    dispatch({ type: 'setReplyMessage', replyMsgInfo: message });
  };

  const closeReply = useCallback(() => {
    dispatch({ type: 'setReplyMessage', replyMsgInfo: null });
  }, []);

  const closeThread = () => {
    // client.messages.openThread(null);
    dispatch({ type: 'openThread', message: null });
    dispatch({ type: 'setThreadList', threadList: null });
  };

  const handleOpenAllThread = async () => {
    dispatch({ type: 'setOpenAllThread', openAllThread: true });
    dispatch({ type: 'setThreadLoading', threadLoading: true });
    // await client.messages.openAllThread();
    dispatch({ type: 'setThreadLoading', threadLoading: false });
  };

  const closeAllThreadList = () => {
    dispatch({ type: 'setOpenAllThread', openAllThread: false });
    // client.messages.openAllThread(null);
  };

  const getMessageList = async () => {
    // const { messages, channel } = client;
    // if (channel.activeChannel) {
    //   dispatch({ type: 'setMsgLoading', msgLoading: true });
    //   await messages.getMessageList({ room_id: channel.activeChannel.room_id });
    //   dispatch({ type: 'setMsgLoading', msgLoading: false });
    // }
  };

  const ChannelStateContextValue: ChannelStateContextValue = useMemo(
    () => ({
      ...state,
    }),
    [state],
  );

  const channelActionContextValue: ChannelActionContextValue = useMemo(
    () => ({
      dispatch,
      handleOpenThread,
      handleToReply,
      closeThread,
      handleOpenAllThread,
      closeAllThreadList,
      closeReply,
    }),
    [],
  );

  const componentContextValue: ComponentContextValue = useMemo(
    () => ({
      Message: props.Message || MessageSimple,
      Input: props.Input || MessageInputFlat,
      ThreadHeader: props.ThreadHeader || DefaultThreadHeader,
    }),
    [],
  );

  const ChildrenDOM = useCallback(() => {
    if (!activeChannel) {
      return null;
    }
    return (
      <div
        className={cx(
          ss.chatContainerClass,
          {
            [ss.mobileStyle]: appType !== AppTypeEnum['pc'],
          },
          className,
        )}
      >
        {children}
      </div>
    );
  }, [appType, activeChannel]);

  return (
    <>
      <ChannelStateProvider value={ChannelStateContextValue}>
        <ChannelActionProvider value={channelActionContextValue}>
          <ComponentProvider value={componentContextValue}>
            <ChildrenDOM />
          </ComponentProvider>
        </ChannelActionProvider>
      </ChannelStateProvider>
    </>
  );
};
