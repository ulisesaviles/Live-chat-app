// This type allows to handle colors easyly
export type ColorSchemeType = "dark" | "light";

// Message type
export type messageType = "img" | "txt";

export enum InCallOptions {
  VIDEO = 'video',
  AUDIO = 'audio',
  SWAP = 'swap',
  END_CALL = 'endCall',
  ANSWER_CALL = 'answer'
};

export enum CallStates {
  WAITING = 'waiting',
  ON_CALL = 'onCall',
  CALL_ENDED = 'ended',
  INCOMING_CALL = 'incoming'
};

