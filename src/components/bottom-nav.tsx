'use client';

import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  items: NavItem[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
}

export function BottomNav({ items, activeTab, setActiveTab }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-card">
      <div className="flex h-20 items-center justify-around">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-md p-2 text-muted-foreground transition-colors duration-200',
              { 'text-primary': activeTab === item.id }
            )}
            aria-current={activeTab === item.id ? "page" : undefined}
          >
            <item.icon className="h-7 w-7" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
