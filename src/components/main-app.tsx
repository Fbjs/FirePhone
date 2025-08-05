'use client';

import { useState } from 'react';
import { Dialpad } from './dialpad';
import { CallHistory } from './call-history';
import { BookUser, Clock, Phone, Settings, User } from 'lucide-react';
import { BottomNav } from './bottom-nav';
import type { CallState, Contact } from '@/types';
import { OngoingCall } from './ongoing-call';
import { IncomingCall } from './incoming-call';
import { useAuth } from '@/lib/auth';
import { Button } from './ui/button';
import { ContactList } from './contact-list';
import { ContactForm } from './contact-form';

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
  const [callState, setCallState] = useState<CallState>({ status: 'idle' });
  const { logout, user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleStartCall = (number: string) => {
    const contact = contacts.find(c => c.number === number) || { name: number, number };
    setCallState({
      status: 'in-call',
      contact: contact,
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
      contact: { name: 'Jane Doe', number: '(987) 654-3210', avatarUrl: 'https://placehold.co/100x100.png' },
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
          <div className="flex h-full flex-col pb-20">
            {activeTab === 'dialpad' && <Dialpad onCall={handleStartCall} />}
            {activeTab === 'history' && <CallHistory onCall={handleStartCall} />}
            {activeTab === 'contacts' && <ContactList contacts={contacts} onEdit={handleOpenForm} onAdd={() => handleOpenForm()} onCall={handleStartCall} />}
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
      </div>
      <ContactForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveContact}
        contact={editingContact}
      />
    </>
  );
}
