export type SocketMessageType =
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_ACTIVE'
  | 'USER_INACTIVE'
  | 'USER_EXTERNAL_LOGIN'
  | 'USER_EXTERNAL_LOGOUT'
  | 'MSG_SEND'
  | 'MSG_FROM_USER'
  | 'MSG_READ'
  | 'MSG_DELETE'
  | 'MSG_EDIT';

export interface SocketMessage {
  id: string | null;
  type: SocketMessageType;
  payload: SocketPayload | null;
}

export interface SocketPayload {
  user?: User;
  message?: Message;
  error?: string;
  users?: User[];
  messages?: Message[];
}

export interface User {
  login: string;
  password?: string;
  isLogined?: boolean;
}

export interface Message {
  id?: string;
  from?: string;
  to?: string;
  text?: string;
  datetime?: number;
  status?: MessageStatus;
}

export interface MessageStatus {
  isDelivered?: boolean;
  isReaded?: boolean;
  isEdited?: boolean;
}
