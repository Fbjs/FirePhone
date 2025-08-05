export interface Call {
  id: string;
  type: 'incoming' | 'outgoing' | 'missed';
  contact: string;
  number: string;
  time: string;
  duration: string;
}

export interface Contact {
  id: string;
  name: string;
  number: string;
  avatarUrl?: string;
}

export interface IdleState {
  status: 'idle';
}

export interface InCallState {
  status: 'in-call';
  contact: Omit<Contact, 'id'>;
  isMuted: boolean;
  isSpeaker: boolean;
}

export interface IncomingState {
  status: 'incoming';
  contact: Omit<Contact, 'id'>;
}

export type CallState = IdleState | InCallState | IncomingState;

export interface SipInfo {
    uri: string;
    server: string;
    password?: string;
}
