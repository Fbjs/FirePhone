'use client';

import { useState, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  number: string;
  avatarUrl?: string;
}

const contacts: Contact[] = [
  { id: '1', name: 'Juan Pérez', number: '555-0101', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '2', name: 'María García', number: '555-0102', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '3', name: 'Carlos Rodríguez', number: '555-0103' },
  { id: '4', name: 'Ana Martínez', number: '555-0104', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '5', name: 'Luisa Hernández', number: '555-0105' },
  { id: '6', name: 'Jorge González', number: '555-0106', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: '7', name: 'Sofía López', number: '555-0107' },
  { id: '8', name: 'Miguel Ramirez', number: '555-0108' },
];

export function ContactList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = useMemo(() => {
    if (!searchTerm) {
      return contacts;
    }
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.number.includes(searchTerm)
    );
  }, [searchTerm]);

  return (
    <div className="flex h-full flex-col">
       <div className="p-4 pb-2">
         <h2 className="text-2xl font-bold tracking-tight">Contactos</h2>
         <p className="text-muted-foreground">Tu agenda telefónica.</p>
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
              <CardContent className="flex items-center gap-4 p-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatarUrl} alt={contact.name} data-ai-hint="person portrait" />
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.number}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
