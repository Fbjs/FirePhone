'use client';

import { useEffect, useState, useRef } from 'react';
import { Dialpad } from './dialpad';
import { CallHistory } from './call-history';
import { BookUser, Clock, Phone, Settings } from 'lucide-react';
import { BottomNav } from './bottom-nav';
import type { Contact, SipInfo } from '@/types';
import { OngoingCall } from './ongoing-call';
import { IncomingCall } from './incoming-call';
import { useAuth } from '@/lib/auth';
import { ContactList } from './contact-list';
import { ContactForm } from './contact-form';
import { useSip } from '@/hooks/useSip';
import { SipSettings } from './sip-settings';
import { useToast } from '@/hooks/use-toast';

const initialContacts: Contact[] = [
    { id: '1', name: 'Juan Pérez', number: '555-0101', avatarUrl: 'https://placehold.co/100x100.png' },
    { id: '2', name: 'María García', number: '555-0102', avatarUrl: 'https://placehold.co/100x100.png' },
    { id: '3', name: 'Carlos Rodríguez', number: '555-0103' },
    { id: '4', name: 'Ana Martínez', number: '555-0104', avatarUrl: 'https://placehold.co/100x100.png' },
    { id: '5', name: 'Luisa Hernández', number: '555-0105' },
    { id: '6', name: 'Jorge González', number: '555-0106', avatarUrl: 'https://placehold.co/100x100.png' },
    { id: '7', name: 'Sofía López', number: '555-0107' },
    { id: '8', name: 'Miguel Ramirez', number: '555-0108' },
];

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('dialpad');
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  const { logout, user } = useAuth();
  const { toast } = useToast();

  const { callState, connect, disconnect, startCall, endCall, acceptCall, toggleMute, toggleSpeaker, sendDTMF, connectionStatus } = useSip();

  const ringtoneRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (callState.status === 'incoming' && ringtoneRef.current) {
        ringtoneRef.current.play().catch(console.error);
    } else if (ringtoneRef.current) {
        ringtoneRef.current.pause();
        ringtoneRef.current.currentTime = 0;
    }
  }, [callState.status]);


  const handleSaveSipSettings = (sipInfo: SipInfo) => {
    connect(sipInfo);
  };
  
  const handleStartCall = (number: string) => {
    if (connectionStatus !== 'connected') {
      toast({
        title: 'Error de Conexión',
        description: 'Por favor, conecta tu cuenta SIP en Ajustes.',
        variant: 'destructive',
      });
      return;
    }
    const contact = contacts.find(c => c.number === number) || { name: number, number };
    startCall(number, contact);
  };
  
  const handleEndCall = () => {
    endCall();
  };
  
  const handleAcceptCall = () => {
    acceptCall();
  };

  const handleOpenForm = (contact: Contact | null = null) => {
    setEditingContact(contact);
    setIsFormOpen(true);
  }

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingContact(null);
  }

  const handleSaveContact = (contact: Contact) => {
    setContacts(prev => {
        const existing = prev.find(c => c.id === contact.id);
        if (existing) {
            return prev.map(c => c.id === contact.id ? contact : c);
        }
        return [...prev, contact];
    });
    handleCloseForm();
  }

  const navItems = [
    { id: 'history', label: 'Historial', icon: Clock },
    { id: 'contacts', label: 'Contactos', icon: BookUser },
    { id: 'dialpad', label: 'Teclado', icon: Phone },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ];

  return (
    <>
      <div className="flex h-screen w-full justify-center bg-background">
        <div className="relative h-full w-full max-w-md border-x bg-background md:shadow-lg">
          <main className="h-full pb-20">
            {activeTab === 'dialpad' && <Dialpad onCall={handleStartCall} />}
            {activeTab === 'history' && <CallHistory onCall={handleStartCall} />}
            {activeTab === 'contacts' && <ContactList contacts={contacts} onEdit={handleOpenForm} onAdd={() => handleOpenForm()} onCall={handleStartCall} />}
            {activeTab === 'settings' && (
              <SipSettings
                onSave={handleSaveSipSettings}
                onDisconnect={disconnect}
                connectionStatus={connectionStatus}
                user={user}
                onLogout={logout}
              />
            )}
          </main>

          <BottomNav items={navItems} activeTab={activeTab} setActiveTab={setActiveTab} />
          
          {callState.status === 'in-call' && (
            <OngoingCall
              callState={callState}
              onHangup={handleEndCall}
              onMuteToggle={toggleMute}
              onSpeakerToggle={toggleSpeaker}
              onSendDTMF={sendDTMF}
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
      </div>
      <ContactForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveContact}
        contact={editingContact}
      />
      <audio id="remote-audio" />
      <audio ref={ringtoneRef} src="/sounds/ringtone.mp3" loop />
    </>
  );
}
