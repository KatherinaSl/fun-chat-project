// id - request identifier
// login - user's login
// password - user's password

// type RequestType = 'USER_LOGIN' | 'ERROR';

export interface Message {
  id: string | null;
  type: string;
  payload: MessagePayload;
}

export interface MessagePayload {
  user?: User;
  error?: string;
}

export interface User {
  login: string;
  password?: string;
  isLogined?: boolean;
}
