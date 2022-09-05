export type Message = JSX.Element | string | null;

export type ToastOptions = {
  duration: number;
};

export type ToastType = 'success' | 'error' | 'loading';

export type ToastHandler = (message: Message, options?: ToastOptions) => void;

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToasterProps {
  style?: React.CSSProperties;
  className?: string;
  message: Message;
  position?: ToastPosition;
  type?: ToastType;
}

type SvgEle = Message;

export type SvgFormat = {
  [key in ToastType]?: SvgEle;
};
