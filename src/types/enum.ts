export enum ACCOUNT_CONNECT_TYPE {
  PHONE = 'phone',
  EMAIL = 'email',
  LENS = 'lens',
  ENS = 'ens',
  DOTBIT = 'dotbit',
}

export enum WEB3_MQ_DID_TYPE {
  PHONE = 'phone',
  EMAIL = 'email',
  LENS = 'lens.xyz',
  DOTBIT = 'dotbit',
  ENS = 'ens',
}

export const RSS3_USER_DID_PROFILE_PLATFORM = {
  ens: 'ENS Registrar',
  lens: 'Lens',
  csb: 'Crossbell',
};

// Login Modal
export enum StepStringEnum {
  HOME = 'home',
  VIEW_ALL = 'view_all_desktop',
  LOGIN = 'login',
  QR_CODE = 'qr_code',
  SIGN_UP = 'sign_up',
  CONNECT_LOADING = 'connect_loading',
  CONNECT_ERROR = 'connect_error',
  LOGIN_SIGN_LOADING = 'login_sign_loading',
  RESET_PASSWORD = 'reset_password',
  LOGIN_SIGN_ERROR = 'login_sign_error',
  SIGN_UP_SIGN_LOADING = 'sign_up_sign_loading',
  SIGN_UP_SIGN_ERROR = 'sign_up_sign_error',
  REJECT_CONNECT = 'reject_connect',
}

export enum SignAuditTypeEnum {
  GET_KEYS_FOR_LOGIN = 'get_Keys_For_Login',
  GET_KEYS_FOR_REGISTER = 'get_keys_For_Register',
  REGISTER = 'register',
}

export type WalletInfoType = {
  name: string;
  type: 'eth' | 'starknet' | 'web3mq' | 'walletConnect';
};


// BindDid Modal
// FollowUser Modal
export enum StepStringEnum {
  SIGN_LOADING = 'sign_loading',
  SIGN_ERROR = 'sign_error',
  READY_SIGN_UP = 'ready_sign_up',
  READY_BIND = 'ready_bind',
  DID_BINDING = 'did_binding',
  DID_BIND_SUCCESS = 'did_bind_success',
  DID_BIND_ERROR = 'did_bind_error',

}

// Auth to dapp
export enum StepStringEnum {
  READY_AUTH_TO_DAPP = 'ready_auth_to_dapp',
  AUTH_DAPP_SUCCESS = 'auth_dapp_success',
  AUTH_DAPP_ERROR = 'auth_dapp_error',
  AUTHING = 'authing',
}