import { SOCKET_MSG_TYPE } from '../constants';

export type SocketMessageType = keyof typeof SOCKET_MSG_TYPE;

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
