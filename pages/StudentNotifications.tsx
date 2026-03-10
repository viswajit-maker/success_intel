import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';

export function StudentNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/notifications')
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading notifications...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Notifications</h1>
        <p className="text-slate-400">Stay updated on your academic alerts and announcements.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((note) => (
              <div key={note.id} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className={`p-2 rounded-full ${
                  note.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                  note.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {note.type === 'alert' && <AlertTriangle className="w-5 h-5" />}
                  {note.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  {note.type === 'info' && <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-200">{note.title}</h4>
                  <p className="text-sm text-slate-400 mt-1">{note.message}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">{note.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
