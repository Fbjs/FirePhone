'use client';
import { useState, useCallback, useRef } from 'react';
import * as JsSIP from 'jssip';
import type { CallState, Contact, SipInfo } from '@/types';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

let ua: JsSIP.UA | null = null;

export const useSip = () => {
  const [callState, setCallState] = useState<CallState>({ status: 'idle' });
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const sessionRef = useRef<JsSIP.RTCSession | null>(null);

  const handleConnecting = useCallback(() => {
    console.log('SIP connecting...');
    setConnectionStatus('connecting');
  }, []);

  const handleConnected = useCallback(() => {
    console.log('SIP connected');
    setConnectionStatus('connected');
  }, []);

  const handleDisconnected = useCallback(() => {
    console.log('SIP disconnected');
    setConnectionStatus('disconnected');
  }, []);

  const handleNewRTCSession = useCallback((e: JsSIP.NewRTCSessionEvent) => {
    const newSession = e.session;
    sessionRef.current = newSession;

    if (newSession.direction === 'incoming') {
      const remoteUri = newSession.remote_identity.uri;
      setCallState({
        status: 'incoming',
        contact: {
          name: newSession.remote_identity.display_name || remoteUri.user || 'Desconocido',
          number: remoteUri.user || 'Desconocido',
        },
      });
    }

    newSession.on('ended', () => {
      setCallState({ status: 'idle' });
      sessionRef.current = null;
    });

    newSession.on('failed', () => {
      setCallState({ status: 'idle' });
      sessionRef.current = null;
    });
    
    newSession.on('peerconnection', (data: { peerconnection: RTCPeerConnection }) => {
        const peerconnection = data.peerconnection;
        peerconnection.ontrack = (e) => {
            const remoteAudio = document.getElementById('remote-audio') as HTMLAudioElement;
            if (remoteAudio) {
                remoteAudio.srcObject = e.streams[0];
                remoteAudio.play().catch(error => console.error("Audio play failed:", error));
            }
        };
    });

    newSession.on('accepted', () => {
        const remoteUri = newSession.remote_identity.uri;
        setCallState(prev => {
            const contact = (prev.status !== 'idle' && prev.contact) ? prev.contact : {
                name: newSession.remote_identity.display_name || remoteUri.user || 'Desconocido',
                number: remoteUri.user || 'Desconocido',
            };
            return {
                status: 'in-call',
                contact: contact,
                isMuted: false,
                isSpeaker: false,
            }
        });
    });

  }, []);

  const handleRegistrationFailed = useCallback((e: JsSIP.RegistrationFailedEvent) => {
    console.error('SIP registration failed:', e.cause);
    setConnectionStatus('error');
  }, []);

  const connect = useCallback((sipInfo: SipInfo) => {
    if (ua && ua.isRegistered()) {
      ua.unregister();
    }
    if(ua && ua.isConnected()){
      ua.stop();
    }

    try {
      JsSIP.debug.enable('JsSIP:*');
      const socket = new JsSIP.WebSocketInterface(sipInfo.server);
      const configuration: JsSIP.UAConfiguration = {
        sockets: [socket],
        uri: sipInfo.uri,
        password: sipInfo.password,
        register: true,
      };

      ua = new JsSIP.UA(configuration);

      ua.on('connecting', handleConnecting);
      ua.on('connected', handleConnected);
      ua.on('disconnected', handleDisconnected);
      ua.on('newRTCSession', handleNewRTCSession);
      ua.on('registrationFailed', handleRegistrationFailed);

      ua.start();
    } catch (e) {
      console.error("Failed to initialize JsSIP", e);
      setConnectionStatus('error');
    }

  }, [handleConnecting, handleConnected, handleDisconnected, handleNewRTCSession, handleRegistrationFailed]);

  const disconnect = useCallback(() => {
    if (ua) {
      ua.stop();
      ua = null;
      setConnectionStatus('disconnected');
      setCallState({ status: 'idle' });
    }
  }, []);
  
  const startCall = useCallback((number: string, contact?: Omit<Contact, 'id'>) => {
    if (ua && ua.isRegistered()) {
      const eventHandlers = {
        'failed': (e: any) => {
            setCallState({ status: 'idle' });
            sessionRef.current = null;
        },
        'ended': (e: any) => {
            setCallState({ status: 'idle' });
            sessionRef.current = null;
        },
      };

      const options = {
        'eventHandlers': eventHandlers,
        'mediaConstraints': { 'audio': true, 'video': false }
      };

      try {
        const session = ua.call(`sip:${number}@${ua.configuration.uri.host}`, options);
        if (session) {
            sessionRef.current = session;
             setCallState({
                status: 'in-call',
                contact: contact || { name: number, number },
                isMuted: false,
                isSpeaker: false
            });
        }
      } catch (e) {
          console.error("Call failed to start", e);
      }
    }
  }, []);

  const endCall = useCallback(() => {
    if (sessionRef.current && !sessionRef.current.isEnded()) {
      sessionRef.current.terminate();
    }
    setCallState({ status: 'idle' });
  }, []);
  
  const acceptCall = useCallback(() => {
    if (sessionRef.current && sessionRef.current.direction === 'incoming') {
      sessionRef.current.answer({ mediaConstraints: { audio: true, video: false } });
    }
  }, []);

  const toggleMute = useCallback(() => {
      if (sessionRef.current && callState.status === 'in-call') {
          const isMuted = callState.isMuted;
          if (isMuted) {
              sessionRef.current.unmute({ audio: true });
          } else {
              sessionRef.current.mute({ audio: true });
          }
          setCallState(prev => prev.status === 'in-call' ? {...prev, isMuted: !isMuted} : prev);
      }
  }, [callState]);
  
  const toggleSpeaker = useCallback(() => {
      if (callState.status === 'in-call') {
          // Web API for speaker control is limited.
          // This is mostly for UI state management.
          console.log("Speaker toggle is a UI-only feature in this example.");
          setCallState(prev => prev.status === 'in-call' ? {...prev, isSpeaker: !prev.isSpeaker} : prev);
      }
  }, [callState]);

  const sendDTMF = useCallback((tone: string) => {
    if (sessionRef.current && callState.status === 'in-call') {
        try {
            sessionRef.current.sendDTMF(tone);
        } catch(e) {
            console.error("Failed to send DTMF tone", e);
        }
    }
  }, [callState.status]);


  return { callState, connectionStatus, connect, disconnect, startCall, endCall, acceptCall, toggleMute, toggleSpeaker, sendDTMF };
};
