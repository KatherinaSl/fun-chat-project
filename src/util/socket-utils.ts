import {
  SocketMessage,
  SocketMessageType,
  SocketPayload,
} from '../data/interfaces';

function getRandomRequestId() {
  return window.self.crypto.randomUUID();
}

export default function createSocketMessage(
  type: SocketMessageType,
  payload: SocketPayload | null = null
): SocketMessage {
  return {
    id: getRandomRequestId(),
    type,
    payload,
  };
}
