import React from 'react';
import ss from './index.scss';

export type ChatDownProps = {
    /** The type of error */
    type: string;
    /** The image url for this error */
    image?: string;
    /** The error message to show */
    text?: string;
}
// TODO: placeholder这里占位符要替换掉
let placeholder = 'https://img1.baidu.com/it/u=3896087392,4020175061&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500';
export const ChatDown = (props: ChatDownProps) => {
  const { image, text, type = 'Error' } = props;
  return (
    <div className={ss.chatDownContainer}>
      <div className={ss.chatDownMain}>
        <img alt='Connection error' data-testid='chatdown-img' src={image || placeholder} />
        <h1>{type}</h1>
        <h3 aria-live='assertive'>
          {text || 'Error connecting to chat, refresh the page to try again.'}
        </h3>
      </div>
    </div>
  );
};