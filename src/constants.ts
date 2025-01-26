export const APP_NAME = 'Fun Chat';
export const APP_DISCRIPTION =
  'The application is designed to demonstrate the assignment Fun Chat within the course RSSchool';

export const APP_PAGES = {
  ABOUT_PAGE: 'About',
  LOGIN_PAGE: 'Login',
};

export const LOGIN_PHRASE = 'LOGIN';

export const BUTTONS = {
  LOGOUT_BUTTON: 'Log out',
  BACK_BUTTON: 'Back',
  SIGNIN_BUTTON: 'Sing in',
  SEND_BUTTON: 'Send',
};

export const SOCKET_MSG_TYPE = {
  ERROR: 'ERROR',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_ACTIVE: 'USER_ACTIVE',
  USER_INACTIVE: 'USER_INACTIVE',
  USER_EXTERNAL_LOGIN: 'USER_EXTERNAL_LOGIN',
  USER_EXTERNAL_LOGOUT: 'USER_EXTERNAL_LOGOUT',
  MSG_SEND: 'MSG_SEND',
  MSG_FROM_USER: 'MSG_FROM_USER',
  MSG_DELIVER: 'MSG_DELIVER',
  MSG_READ: 'MSG_READ',
  MSG_DELETE: 'MSG_DELETE',
  MSG_EDIT: 'MSG_EDIT',
} as const;

export const SRC_ALT = {
  RSS_LINK: 'rsschool-link',
  GH_LINK: 'github-link',
};

export const USER_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
};

export const MESSAGE_ACTIONS = {
  NEW_MESSAGE: 'message',
  DELIVER: 'deliver',
  READ: 'read',
};

export const NAME_PLACEHOLDER = 'Please, enter your name';
export const PASSWORD_PLACEHOLDER = 'Please, enter your password';
export const SEARCH_PLACEHOLDER = 'Search...';
export const MSG_PLACEHOLDER = 'Write a message...';

export const CHOOSE_USER_MSG = 'Select a chat to start messaging...';
export const START_DIALOGUE_MSG = 'Write your first message...';
