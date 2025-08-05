'use client';

import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Edit, Plus, Phone } from 'lucide-react';
import type { Contact } from '@/types';
import { Button } from './ui/button';

interface ContactListProps {
  contacts: Contact[];
  onEdit: (contact: Contact) => void;
  onAdd: () => void;
  onCall: (number: string) => void;
}

export function ContactList({ contacts, onEdit, onAdd, onCall }: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = useMemo(() => {
    const sortedContacts = [...contacts].sort((a, b) => a.name.localeCompare(b.name));
    if (!searchTerm) {
      return sortedContacts;
    }
    return sortedContacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.number.includes(searchTerm)
    );
  }, [contacts, searchTerm]);

  return (
    <div className="flex h-full flex-col">
       <div className="p-4 pb-2">
         <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Contactos</h2>
                <p className="text-muted-foreground">Tu agenda telefónica.</p>
            </div>
            <Button onClick={onAdd} size="icon" className="rounded-full">
                <Plus className="h-5 w-5" />
                <span className="sr-only">Añadir Contacto</span>
            </Button>
         </div>
         <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder="Buscar contacto..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
       </div>
      <ScrollArea className="flex-1 p-4 pt-2">
        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="overflow-hidden">
              <CardContent className="flex items-center gap-2 p-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatarUrl} alt={contact.name} data-ai-hint="person portrait" />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.number}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onCall(contact.number)}>
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">Llamar</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onEdit(contact)}>
                    <Edit className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">Editar</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
