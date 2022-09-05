import { useRef, useState } from 'react';
import { useChatContext } from '../../../context/ChatContext';

type MessageLoadMore = {
  showLoading: boolean;
  loadMore: () => void;
};

export const useMessageLoadMore = (isThread: boolean): MessageLoadMore => {
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const noMoreRef = useRef<boolean>(false);

  const { client } = useChatContext('useMessageLoadMore');
  const { loadMoreMessageList, loadMoreThreadList } = client.messages;

  const loadMoreFn = isThread ? loadMoreThreadList : loadMoreMessageList;

  const loadMore = async () => {
    if (noMoreRef.current) {
      return;
    }
    setShowLoading(true);
    const data = (await loadMoreFn()) || [];
    setShowLoading(false);
    if (data.length === 0) {
      noMoreRef.current = true;
    }
    return data.length === 0;
  };

  return { showLoading, loadMore };
};
