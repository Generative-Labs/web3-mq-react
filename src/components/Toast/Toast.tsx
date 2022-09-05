import React from 'react';
import ReactDOM from 'react-dom';
import type { Message, ToastType, ToastOptions, ToastHandler } from './type';

import Toaster from './Toaster';

import ss from './index.scss';

const createHandler =
  (type?: ToastType): ToastHandler =>
    (messge, opt) => {
      let parentNode = document.querySelector('#toast-wrapper');

      if (!parentNode) {
        parentNode = document.createElement('div');
        parentNode.setAttribute('id', 'toast-wrapper');
        parentNode.classList.add(ss['toast-wrapper']);
        document.body.appendChild(parentNode);
      }
      let toast = document.createElement('div');
      parentNode.appendChild(toast);
      ReactDOM.render(<Toaster message={messge} type={type} {...opt} />, toast);

      setTimeout(() => {
        parentNode?.removeChild(toast);
        if (parentNode?.childNodes.length === 0) {
          document.body.removeChild(parentNode);
        }
      }, opt?.duration || 2000);
    };

export const toast = (message: Message, opts?: ToastOptions) => createHandler()(message, opts);

toast.error = createHandler('error');
toast.success = createHandler('success');
toast.loading = createHandler('loading');
