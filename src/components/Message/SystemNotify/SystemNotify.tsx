import React, { useCallback } from 'react';
import { Loading } from '../../Loading';
import { useMessageContext } from '../../../context/MessageContext';

import ss from './index.scss';

type IProps = {
  content: string;
};

export const SystemNotify: React.FC<IProps> = (props) => {
  const { content } = props;
  return (
    <div className={ss.systemContainer}>
      <div className={ss.systemInner}>
        <div className={ss.text}>{content}</div>
      </div>
    </div>
  );
};
