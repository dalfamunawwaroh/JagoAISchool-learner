import React from 'react';
import { Symbol } from '../components/ui/Symbol';

export const ComingSoon = ({ pageName }: { pageName: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <Symbol name="construction" className="text-6xl text-gray-200" />
      <h2 className="text-2xl font-display font-bold text-gray-300 uppercase tracking-widest">{pageName} Coming Soon</h2>
    </div>
  );
};
