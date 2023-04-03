import React, { useState } from 'react';
import SignClient from '@walletconnect/sign-client';
import { Web3Modal } from '@web3modal/standalone';
import type { SessionTypes } from '@walletconnect/types';
import * as encoding from '@walletconnect/encoding';

type IProps = {
  walletConnectClient: React.MutableRefObject<SignClient | undefined>;
  propWcSession?: SessionTypes.Struct,
};

const projectId = '1c5ee52c12a9145d5b184e06120462cc';
const relay = 'wss://relay.walletconnect.com';

const web3Modal = new Web3Modal({
  projectId,
  walletConnectVersion: 2,
  // `standaloneChains` can also be specified when calling `web3Modal.openModal(...)` later on.
  standaloneChains: ['eip155:1'],
});

const useWalletConnect = (props: IProps) => {
  const { walletConnectClient, propWcSession } = props;
  const [wcSession, setWcSession] = useState<SessionTypes.Struct | undefined>(propWcSession);
  const _subscribeToEvents = async (_client: SignClient) => {
    if (typeof _client === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }

    _client.on('session_ping', (args) => {
      console.log('EVENT', 'session_ping', args);
    });

    _client.on('session_event', (args) => {
      console.log('EVENT', 'session_event', args);
    });

    _client.on('session_update', ({ topic, params }) => {
      console.log('EVENT', 'session_update', { topic, params });
      const { namespaces } = params;
      const _session = _client.session.get(topic);
      const updatedSession = { ..._session, namespaces };
      onSessionConnected(updatedSession);
    });

    _client.on('session_delete', () => {
      console.log('EVENT', 'session_delete');
    });
  };

  const _checkPersistedState = async (_client: SignClient) => {
    if (typeof _client === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }
    // populates existing pairings to state
    const curPairing = _client.pairing.getAll({ active: true });
    // setPairings(curPairing);
    console.log('RESTORED PAIRINGS: ', _client.pairing.getAll({ active: true }));

    if (typeof wcSession !== 'undefined') return;
    // populates (the last) existing session to state
    if (_client.session.length) {
      const lastKeyIndex = _client.session.keys.length - 1;
      const _session = _client.session.get(_client.session.keys[lastKeyIndex]);
      console.log('RESTORED SESSION:', _session);
      onSessionConnected(_session);
    }
  };

  const create = async () => {
    if (walletConnectClient.current) return;
    walletConnectClient.current = await SignClient.init({
      projectId,
      // optional parameters
      relayUrl: relay,
      metadata: {
        name: 'react component',
        description: 'react component',
        url: window.location.host,
        icons: [],
      },
    });
    await _subscribeToEvents(walletConnectClient.current);
    // await _checkPersistedState(walletConnectClient.current);
  };

  const connect = async () => {
    if (typeof walletConnectClient.current === 'undefined') {
      throw new Error('WalletConnect is not initialized');
    }
    const { uri, approval } = await walletConnectClient.current.connect({
      requiredNamespaces: {
        eip155: {
          methods: ['personal_sign'],
          chains: ['eip155:1'],
          events: ['chainChanged', 'accountsChanged'],
        },
      },
    });

    // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
    if (uri) {
      // Create a flat array of all requested chains across namespaces.
      web3Modal.openModal({ uri });
    }
    const session = await approval();
    return session;
  };

  const closeModal = () => {
    web3Modal.closeModal();
  };

  const onSessionConnected = (_session: SessionTypes.Struct) => {
    // const allNamespaceAccounts = Object.values(_session.namespaces)
    //   .map((namespace) => namespace.accounts)
    //   .flat();
    // const allNamespaceChains = Object.keys(_session.namespaces);
    setWcSession(_session);
  };

  const sendSignByWalletConnect = async (signContent: string, address: string) => {
    // encode message (hex)
    const hexMsg = encoding.utf8ToHex(signContent, true);
    // personal_sign params
    const params = [hexMsg, address];
    // send message
    const signature = await walletConnectClient.current?.request({
      topic: wcSession?.topic as string,
      chainId: 'eip155:1',
      request: {
        method: 'personal_sign',
        params,
      },
    });
    return {
      signature,
    };
  };

  return {
    wcSession,
    create,
    connect,
    closeModal,
    onSessionConnected,
    sendSignByWalletConnect
  };
};

export default useWalletConnect;
