import type { Reducer } from 'react';
import type { ChannelResponse } from 'web2-mq';

import type { ChannelState, MessageItem } from '../../context/ChannelStateContext';

export const initialState: ChannelState = {
  messageList: null,
  threadList: null,
  message: null,
  replyMsgInfo: null,
  activeChannel: null,
  allThreadList: null,
  openAllThread: false,
  msgLoading: false,
  threadLoading: false,
};

export type ChannelStateReducerAction =
  | {
      type: 'setMessageList';
      messageList: MessageItem[] | null;
    }
  | {
      type: 'openThread';
      message: MessageItem | null;
    }
  | {
      type: 'setThreadList';
      threadList: MessageItem[] | null;
    }
  | {
      type: 'setAllThreadList';
      allThreadList: MessageItem[] | null;
    }
  | {
      type: 'setActiveChannel';
      activeChannel: ChannelResponse | null;
    }
  | {
      type: 'setOpenAllThread';
      openAllThread: boolean;
    }
  | {
      type: 'setMsgLoading';
      msgLoading: boolean;
    }
  | {
      type: 'setThreadLoading';
      threadLoading: boolean;
    }
  | {
      type: 'setReplyMessage';
      replyMsgInfo: MessageItem | null;
    };

export type ChannelStateReducer = Reducer<ChannelState, ChannelStateReducerAction>;

export const channelReducer = (state: ChannelState, action: ChannelStateReducerAction) => {
  switch (action.type) {
  case 'setMessageList':
    return { ...state, messageList: action.messageList };
  case 'openThread':
    return { ...state, message: action.message };
  case 'setThreadList':
    return { ...state, threadList: action.threadList };
  case 'setActiveChannel':
    return { ...state, activeChannel: action.activeChannel };
  case 'setAllThreadList':
    return { ...state, allThreadList: action.allThreadList };
  case 'setMsgLoading':
    return { ...state, msgLoading: action.msgLoading };
  case 'setThreadLoading':
    return { ...state, threadLoading: action.threadLoading };
  case 'setOpenAllThread':
    return { ...state, openAllThread: action.openAllThread };
  case 'setReplyMessage':
    return { ...state, replyMsgInfo: action.replyMsgInfo };
  default:
    return state;
  }
};
