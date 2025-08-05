'use client';

import { useState } from 'react';
import { Dialpad } from './dialpad';
import { CallHistory } from './call-history';
import { Clock, Phone, Settings, User } from 'lucide-react';
import { BottomNav } from './bottom-nav';
import type { CallState } from '@/types';
import { OngoingCall } from './ongoing-call';
import { IncomingCall } from './incoming-call';
import { useAuth } from '@/lib/auth';
import { Button } from './ui/button';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('dialpad');
  const [callState, setCallState] = useState<CallState>({ status: 'idle' });
  const { logout, user } = useAuth();

  const handleStartCall = (number: string) => {
    setCallState({
      status: 'in-call',
      contact: { name: number, number },
      isMuted: false,
      isSpeaker: false,
    });
  };
  
  const handleEndCall = () => {
    setCallState({ status: 'idle' });
  };
  
  const handleSimulateIncomingCall = () => {
    setCallState({
      status: 'incoming',
      contact: { name: 'Jane Doe', number: '(987) 654-3210' },
    });
  };
  
  const handleAcceptCall = () => {
    if (callState.status === 'incoming') {
      setCallState({
        status: 'in-call',
        contact: callState.contact,
        isMuted: false,
        isSpeaker: false,
      });
    }
  };

  const navItems = [
    { id: 'history', label: 'Historial', icon: Clock },
    { id: 'dialpad', label: 'Teclado', icon: Phone },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <div className="flex h-full flex-col pb-20">
        {activeTab === 'dialpad' && <Dialpad onCall={handleStartCall} />}
        {activeTab === 'history' && <CallHistory />}
        {activeTab === 'settings' && (
           <div className="flex h-full flex-col items-center justify-center p-4">
              <User className="h-24 w-24 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">{user?.email}</p>
              <p className="text-muted-foreground">Ajustes próximamente</p>
              <Button onClick={handleSimulateIncomingCall} className="mt-8">
                  Simular Llamada Entrante
              </Button>
              <Button variant="link" onClick={logout} className="mt-4 text-destructive">
                Cerrar Sesión
              </Button>
           </div>
        )}
      </div>

      <BottomNav items={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {callState.status === 'in-call' && (
        <OngoingCall
          callState={callState}
          onHangup={handleEndCall}
          onMuteToggle={() => setCallState(prev => prev.status === 'in-call' ? {...prev, isMuted: !prev.isMuted} : prev)}
          onSpeakerToggle={() => setCallState(prev => prev.status === 'in-call' ? {...prev, isSpeaker: !prev.isSpeaker} : prev)}
        />
      )}
      {callState.status === 'incoming' && (
        <IncomingCall
          caller={callState.contact}
          onAccept={handleAcceptCall}
          onDecline={handleEndCall}
        />
      )}
    </div>
  );
}
