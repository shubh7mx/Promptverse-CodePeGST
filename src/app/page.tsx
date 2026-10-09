'use client';

import React from 'react';
import { CommandMap } from '@/components/map/CommandMap';

export default function HomePage() {
  return (
    <div className="relative h-[calc(100vh-3.25rem)] w-full overflow-hidden bg-slate-950">
      <CommandMap />
    </div>
  );
}
