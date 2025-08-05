'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Phone, Delete } from 'lucide-react';

interface DialpadProps {
  onCall: (number: string) => void;
}

export function Dialpad({ onCall }: DialpadProps) {
  const [number, setNumber] = useState('');

  const handleKeyPress = (key: string) => {
    setNumber((prev) => prev + key);
  };

  const handleDelete = () => {
    setNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (number) {
      onCall(number);
    }
  };

  const dialpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  return (
    <div className="flex h-full flex-col items-center justify-between p-4">
      <div className="w-full max-w-xs space-y-4">
        <div className="relative">
          <Input
            type="tel"
            value={number}
            readOnly
            placeholder="Enter number"
            className="h-14 text-center text-3xl font-light tracking-wider"
          />
          {number && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={handleDelete}
            >
              <Delete className="h-6 w-6" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid w-full max-w-xs grid-cols-3 gap-2">
        {dialpadKeys.map((key) => (
          <Button
            key={key}
            variant="outline"
            className="h-20 rounded-full text-2xl font-light"
            onClick={() => handleKeyPress(key)}
          >
            {key}
            {key === '0' && <span className="text-xs">+</span>}
          </Button>
        ))}
      </div>
      
      <div className="w-full max-w-xs">
         <Button
            className="h-20 w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleCall}
            disabled={!number}
          >
            <Phone className="h-8 w-8" />
          </Button>
      </div>
    </div>
  );
}
