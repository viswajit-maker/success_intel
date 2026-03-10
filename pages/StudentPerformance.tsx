import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function StudentPerformance() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/performance')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading performance data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Performance Analytics</h1>
        <p className="text-slate-400">Detailed breakdown of your academic progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-indigo-950/20 border-indigo-500/30">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-40">
            <p className="text-sm font-medium text-indigo-400 mb-2 uppercase tracking-wider">Student Success Score</p>
            <div className="text-5xl font-bold text-white flex items-baseline gap-2">
              88<span className="text-xl text-slate-400 font-normal">/100</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-emerald-950/20 border-emerald-500/30">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center h-40">
            <p className="text-sm font-medium text-emerald-400 mb-2 uppercase tracking-wider">Overall Attendance</p>
            <div className="text-5xl font-bold text-white flex items-baseline gap-2">
              {data.overallAttendance}<span className="text-xl text-slate-400 font-normal">%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Marks Trend Over Time</CardTitle>
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
            <CardTitle>Subject Performance vs Class Average</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="subject" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} cursor={{fill: '#334155', opacity: 0.4}} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} name="Your Score" />
                <Bar dataKey="classAvg" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Class Average" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Subject Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Subject</th>
                  <th className="px-4 py-3">Marks</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3 rounded-tr-lg">Improvement Trend</th>
                </tr>
              </thead>
              <tbody>
                {data.subjectTable.map((row: any, i: number) => (
                  <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">{row.subject}</td>
                    <td className="px-4 py-3 text-slate-300">{row.marks}%</td>
                    <td className="px-4 py-3 font-bold text-indigo-400">{row.grade}</td>
                    <td className="px-4 py-3">
                      {row.trend === 'up' && <span className="flex items-center gap-1 text-emerald-400"><TrendingUp className="w-4 h-4" /> Improving</span>}
                      {row.trend === 'down' && <span className="flex items-center gap-1 text-red-400"><TrendingDown className="w-4 h-4" /> Declining</span>}
                      {row.trend === 'flat' && <span className="flex items-center gap-1 text-slate-400"><Minus className="w-4 h-4" /> Stable</span>}
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
