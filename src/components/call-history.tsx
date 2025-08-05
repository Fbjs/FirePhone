'use client';

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowDownLeft, ArrowUpRight, PhoneMissed } from 'lucide-react';
import type { Call } from '@/types';
import { cn } from '@/lib/utils';

const callHistory: Call[] = [
  { id: '1', type: 'outgoing', contact: 'John Doe', time: '10:45 AM', duration: '5m 32s' },
  { id: '2', type: 'incoming', contact: 'Jane Smith', time: '9:30 AM', duration: '2m 11s' },
  { id: '3', type: 'missed', contact: '(123) 456-7890', time: 'Yesterday', duration: '0m 0s' },
  { id: '4', type: 'outgoing', contact: 'Mom', time: 'Yesterday', duration: '15m 3s' },
  { id: '5', type: 'incoming', contact: 'Work', time: '2 days ago', duration: '30s' },
  { id: '6', type: 'missed', contact: 'Unknown', time: '2 days ago', duration: '0m 0s' },
  { id: '7', type: 'outgoing', contact: 'Dr. Office', time: '2 days ago', duration: '1m 20s' },
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

export function CallHistory() {
  return (
    <div className="flex h-full flex-col">
       <div className="p-4 pb-0">
         <h2 className="text-2xl font-bold tracking-tight">Call History</h2>
         <p className="text-muted-foreground">View your recent calls.</p>
       </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {callHistory.map((call) => (
            <Card key={call.id} className="overflow-hidden">
              <CardContent className="flex items-center gap-4 p-4">
                <CallIcon type={call.type} />
                <div className="flex-1">
                  <p className={cn("font-semibold", call.type === 'missed' && 'text-destructive')}>
                    {call.contact}
                  </p>
                  <p className="text-sm text-muted-foreground">{call.time}</p>
                </div>
                <div className="text-sm text-muted-foreground">{call.duration}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
