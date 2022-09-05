import { Window, MessageInput, MessageList, Thread, MessageHeader, AllThreadList } from 'web3-mq-react';
import MsgInput from '../MsgInput';

// import logo from '../../image/photo-1546820389-44d77e1f3b31.jpeg';

// const PropMessage = () => {
//   return <div>PropMessage</div>;
// };

const ChannelInner = () => {
  return (
    <>
      <Window>
        <MessageHeader avatarSize={40} />
        {/* <MessageList Message={PropMessage} /> */}
        <MessageList />
        <MessageInput Input={MsgInput} />
      </Window>
      <Thread />
      <AllThreadList />
    </>
  );
};

export default ChannelInner;
