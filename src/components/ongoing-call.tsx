'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX, Grid3x3, ChevronLeft } from 'lucide-react';
import type { InCallState } from '@/types';
import { cn } from '@/lib/utils';
import { Dialpad } from './dialpad';

interface OngoingCallProps {
  callState: InCallState;
  onHangup: () => void;
  onMuteToggle: () => void;
  onSpeakerToggle: () => void;
  onSendDTMF: (tone: string) => void;
}

export function OngoingCall({ callState, onHangup, onMuteToggle, onSpeakerToggle, onSendDTMF }: OngoingCallProps) {
  const [duration, setDuration] = useState(0);
  const [showDialpad, setShowDialpad] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const { contact, isMuted, isSpeaker } = callState;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-between bg-background p-8">
       {showDialpad ? (
        <div className="flex h-full w-full flex-col">
            <div className="flex-1">
             <Dialpad onCall={onSendDTMF} showCallButton={false} />
            </div>
            <div className="mx-auto w-full max-w-xs">
                 <Button onClick={() => setShowDialpad(false)} variant="outline" className="h-16 w-full rounded-full">
                    <ChevronLeft className="h-7 w-7" />
                    Volver a la llamada
                </Button>
            </div>
        </div>
      ) : (
      <>
      <div className="flex flex-col items-center pt-16 text-center text-foreground">
        <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
          <AvatarImage src={contact.avatarUrl} alt={contact.name} data-ai-hint="person" />
          <AvatarFallback className="text-5xl">
            {contact.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h2 className="mt-6 text-4xl font-bold">{contact.name}</h2>
        <p className="mt-2 text-xl text-muted-foreground">{formatDuration(duration)}</p>
      </div>

      <div className="grid w-full max-w-xs grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className={cn("h-16 w-16 rounded-full bg-black/5 text-foreground hover:bg-black/10", isMuted && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground')}
              onClick={onMuteToggle}
            >
              {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
            </Button>
            <span className="text-sm text-foreground">Silenciar</span>
        </div>
        <div className="flex flex-col items-center gap-2">
             <Button
                size="icon"
                variant="outline"
                className="h-16 w-16 rounded-full bg-black/5 text-foreground hover:bg-black/10"
                onClick={() => setShowDialpad(true)}
             >
                <Grid3x3 className="h-7 w-7" />
             </Button>
             <span className="text-sm text-foreground">Teclado</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className={cn("h-16 w-16 rounded-full bg-black/5 text-foreground hover:bg-black/10", isSpeaker && 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground')}
              onClick={onSpeakerToggle}
            >
              {isSpeaker ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
            </Button>
            <span className="text-sm text-foreground">Altavoz</span>
        </div>
      </div>

      <Button
        size="icon"
        className="h-20 w-20 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
        onClick={onHangup}
      >
        <PhoneOff className="h-8 w-8" />
      </Button>
      </>
      )}
    </div>
  );
}
