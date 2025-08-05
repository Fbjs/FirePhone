'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Phone, PhoneOff } from 'lucide-react';

interface IncomingCallProps {
  caller: {
    name: string;
    number: string;
    avatarUrl?: string;
  };
  onAccept: () => void;
  onDecline: () => void;
}

export function IncomingCall({ caller, onAccept, onDecline }: IncomingCallProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center text-center text-foreground">
        <p className="mb-4 text-lg text-muted-foreground">Llamada Entrante</p>
        <Avatar className="h-28 w-28 border-4 border-white shadow-lg">
          <AvatarImage src={caller.avatarUrl} alt={caller.name} data-ai-hint="person portrait" />
          <AvatarFallback className="text-4xl">
            {caller.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h2 className="mt-6 text-4xl font-bold">{caller.name}</h2>
        <p className="mt-2 text-xl text-muted-foreground">{caller.number}</p>
      </div>
      <div className="fixed bottom-16 flex w-full max-w-xs justify-around">
        <div className="flex flex-col items-center gap-2">
          <Button
            size="icon"
            className="h-20 w-20 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={onDecline}
          >
            <PhoneOff className="h-8 w-8" />
          </Button>
          <span className="text-foreground">Rechazar</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Button
            size="icon"
            className="h-20 w-20 rounded-full bg-green-500 text-white hover:bg-green-600"
            onClick={onAccept}
          >
            <Phone className="h-8 w-8" />
          </Button>
          <span className="text-foreground">Aceptar</span>
        </div>
      </div>
    </div>
  );
}
