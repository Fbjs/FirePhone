export interface Call {
  id: string;
  type: 'incoming' | 'outgoing' | 'missed';
  contact: string;
  time: string;
  duration: string;
}

interface Contact {
  name: string;
  number: string;
  avatarUrl?: string;
}

export interface IdleState {
  status: 'idle';
}

export interface InCallState {
  status: 'in-call';
  contact: Contact;
  isMuted: boolean;
  isSpeaker: boolean;
}

export interface IncomingState {
  status: 'incoming';
  contact: Contact;
}

export type CallState = IdleState | InCallState | IncomingState;
