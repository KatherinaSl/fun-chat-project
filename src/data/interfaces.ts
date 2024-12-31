export type MessageType =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_ACTIVE'
  | 'USER_INACTIVE'
  | 'USER_EXTERNAL_LOGIN';

export interface Message {
  id: string | null;
  type: MessageType;
  payload: MessagePayload | null;
}

export interface MessagePayload {
  user?: User;
  error?: string;
  users?: User[];
}

export interface User {
  login: string;
  password?: string;
  isLogined?: boolean;
}
