import { useChatContext } from 'web3-mq-react';

const ChatBox: React.FC = () => {
    const chatContext = useChatContext();
    const { client: { connect, useInfo: { useName } } } = chatContext;
    console.log(chatContext)
    return (
        <div>
            {useName}
        </div>
    )
}

export default ChatBox;