import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-slate-400">This module is currently under development.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center text-slate-500">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <span className="text-2xl">🚧</span>
          </div>
          <p>We are working hard to bring you this feature.</p>
        </CardContent>
      </Card>
    </div>
  );
}
