import React, { PropsWithChildren } from 'react';
import cx from 'classnames';

import { AppTypeEnum } from '../../context/ChatContext';
import type { ChannelActionContextValue } from '../../context/ChannelActionContext';
import { ArrowLeft } from '../../icons';

import ss from './index.scss';

export type ThreadHeaderProps = {
  title: string;
  appType?: AppTypeEnum;
  close: ChannelActionContextValue['closeThread'] | ChannelActionContextValue['closeAllThreadList'];
};

export const ThreadHeader = React.memo((props: PropsWithChildren<ThreadHeaderProps>) => {
  const { title, close, appType = AppTypeEnum['pc'] } = props;
  return (
    <div className={ss.threadHeaderContainer}>
      <div className={ss.warp}>
        {appType !== AppTypeEnum['pc'] && (
          <div className={cx(ss.closeBtn, ss.arrowLeft)} onClick={close}>
            <ArrowLeft />
          </div>
        )}
        <div className={ss.title}>{title}</div>
      </div>
      {appType === AppTypeEnum['pc'] && (
        <div className={ss.closeBtn} onClick={close}>
          X
        </div>
      )}
    </div>
  );
});
