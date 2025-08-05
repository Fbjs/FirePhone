'use client';

import type { FC } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowDownLeft, ArrowUpRight, Phone, PhoneMissed } from 'lucide-react';
import type { Call } from '@/types';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const callHistory: Call[] = [
  { id: '1', type: 'outgoing', contact: 'John Doe', number: '555-0101', time: '10:45 AM', duration: '5m 32s' },
  { id: '2', type: 'incoming', contact: 'Jane Smith', number: '555-0102', time: '9:30 AM', duration: '2m 11s' },
  { id: '3', type: 'missed', contact: '(123) 456-7890', number: '(123) 456-7890', time: 'Ayer', duration: '0m 0s' },
  { id: '4', type: 'outgoing', contact: 'Mamá', number: '555-0104', time: 'Ayer', duration: '15m 3s' },
  { id: '5', type: 'incoming', contact: 'Trabajo', number: '555-0105', time: 'Hace 2 días', duration: '30s' },
  { id: '6', type: 'missed', contact: 'Desconocido', number: '555-0106', time: 'Hace 2 días', duration: '0m 0s' },
  { id: '7', type: 'outgoing', contact: 'Consultorio', number: '555-0107', time: 'Hace 2 días', duration: '1m 20s' },
];

const CallIcon: FC<{ type: Call['type'] }> = ({ type }) => {
  switch (type) {
    case 'incoming':
      return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
    case 'outgoing':
      return <ArrowUpRight className="h-5 w-5 text-primary" />;
    case 'missed':
      return <PhoneMissed className="h-5 w-5 text-destructive" />;
    default:
      return null;
  }
};

interface CallHistoryProps {
  onCall: (number: string) => void;
}

export function CallHistory({ onCall }: CallHistoryProps) {
  return (
    <div className="flex h-full flex-col">
       <div className="p-4 pb-0">
         <h2 className="text-2xl font-bold tracking-tight">Historial de Llamadas</h2>
         <p className="text-muted-foreground">Consulta tus llamadas recientes.</p>
       </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {callHistory.map((call) => (
            <Card key={call.id} className="overflow-hidden">
              <CardContent className="flex items-center gap-4 p-3">
                <CallIcon type={call.type} />
                <div className="flex-1">
                  <p className={cn("font-semibold", call.type === 'missed' && 'text-destructive')}>
                    {call.contact}
                  </p>
                  <p className="text-sm text-muted-foreground">{call.time}</p>
                </div>
                <div className="text-sm text-muted-foreground">{call.duration}</div>
                 <Button variant="ghost" size="icon" onClick={() => onCall(call.number)}>
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span className="sr-only">Llamar</span>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
