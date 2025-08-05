'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import type { InCallState } from '@/types';
import { cn } from '@/lib/utils';

interface OngoingCallProps {
  callState: InCallState;
  onHangup: () => void;
  onMuteToggle: () => void;
  onSpeakerToggle: () => void;
}

export function OngoingCall({ callState, onHangup, onMuteToggle, onSpeakerToggle }: OngoingCallProps) {
  const [duration, setDuration] = useState(0);

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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-background p-8">
      <div className="flex flex-col items-center pt-20 text-center text-foreground">
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
        <div className="flex flex-col items-center">
            <Button
              size="icon"
              variant={isMuted ? 'secondary' : 'outline'}
              className={cn("h-16 w-16 rounded-full", isMuted && 'bg-primary text-primary-foreground')}
              onClick={onMuteToggle}
            >
              {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
            </Button>
            <span className="mt-2 text-sm text-foreground">Mute</span>
        </div>
        <div className="flex flex-col items-center">
            <Button
              size="icon"
              variant="outline"
              className="h-16 w-16 rounded-full"
            >
                {/* Placeholder for keypad or other feature */}
            </Button>
        </div>
        <div className="flex flex-col items-center">
            <Button
              size="icon"
              variant={isSpeaker ? 'secondary' : 'outline'}
              className={cn("h-16 w-16 rounded-full", isSpeaker && 'bg-primary text-primary-foreground')}
              onClick={onSpeakerToggle}
            >
              {isSpeaker ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
            </Button>
            <span className="mt-2 text-sm text-foreground">Speaker</span>
        </div>
      </div>

      <Button
        size="icon"
        className="h-20 w-20 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
        onClick={onHangup}
      >
        <PhoneOff className="h-8 w-8" />
      </Button>
    </div>
  );
}
