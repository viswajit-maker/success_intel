import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Activity, BookOpen, CheckCircle, Clock } from 'lucide-react';

export function ParentProgress() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/parent/progress')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading progress data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Child Progress</h1>
        <p className="text-slate-400">Monitor your child's academic performance and assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-indigo-950/20 border-indigo-500/30">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-40">
            <p className="text-sm font-medium text-indigo-400 mb-2 uppercase tracking-wider">Student Success Score</p>
            <div className="text-5xl font-bold text-white flex items-baseline gap-2">
              {data.successScore}<span className="text-xl text-slate-400 font-normal">/100</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-950/20 border-emerald-500/30">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-40">
            <p className="text-sm font-medium text-emerald-400 mb-2 uppercase tracking-wider">Overall Grade</p>
            <div className="text-5xl font-bold text-white flex items-baseline gap-2">
              {data.overallGrade}<span className="text-xl text-slate-400 font-normal"></span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Marks Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.marksTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} name="Average Score" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject Progress Report</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.subjectProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} cursor={{fill: '#334155', opacity: 0.4}} />
                <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Completion Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Assignment Name</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-tr-lg">Score</th>
                </tr>
              </thead>
              <tbody>
                {data.assignments.map((assignment: any) => (
                  <tr key={assignment.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">{assignment.name}</td>
                    <td className="px-4 py-3 text-slate-400">{assignment.subject}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                        assignment.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {assignment.status === 'Submitted' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {assignment.score !== null ? `${assignment.score}%` : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
