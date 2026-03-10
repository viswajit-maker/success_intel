import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Activity, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const DEMO_ATTENDANCE = [
  { month: 'Jan', attendance: 78 },
  { month: 'Feb', attendance: 82 },
  { month: 'Mar', attendance: 80 },
  { month: 'Apr', attendance: 85 },
  { month: 'May', attendance: 83 },
];

const DEMO_MARKS = [
  { subject: 'Math', score: 85 },
  { subject: 'Physics', score: 78 },
  { subject: 'Chemistry', score: 82 },
  { subject: 'Biology', score: 75 },
  { subject: 'English', score: 88 },
];

export function StudentDashboard() {
  const [attendance, setAttendance] = useState<any[]>(DEMO_ATTENDANCE);
  const [marks, setMarks] = useState<any[]>(DEMO_MARKS);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    // Fetch real data if available, otherwise keep demo data
    fetch('/api/attendance').then(res => res.json()).then(data => {
      if (data && data.length > 0) setAttendance(data);
    }).catch(() => {});
    
    fetch('/api/marks').then(res => res.json()).then(data => {
      if (data && data.length > 0) setMarks(data);
    }).catch(() => {});
    
    fetch('/api/assignments').then(res => res.json()).then(setAssignments);
    
    // Simulate getting prediction for the current student
    fetch('/api/predict-risk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attendance_percentage: 82,
        average_marks: 78,
        assignment_completion_rate: 90,
        participation_score: 85
      })
    }).then(res => res.json()).then(setPrediction);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Student Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here is your academic progress and AI-driven insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Success Score" value={prediction?.ssis_score || '--'} icon={Activity} color="text-indigo-400" />
        <MetricCard title="Attendance" value="82%" icon={Clock} color="text-emerald-400" />
        <MetricCard title="Avg. Marks" value="78%" icon={BookOpen} color="text-orange-400" />
        <MetricCard title="Risk Level" value={prediction?.risk_level || '--'} icon={AlertTriangle} color={prediction?.risk_level === 'Low Risk' ? 'text-emerald-400' : 'text-red-400'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                    <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marks by Subject</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marks}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="subject" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} cursor={{fill: '#334155', opacity: 0.4}} />
                    <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assignment Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignments.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <div>
                      <p className="font-medium text-slate-200">{a.title}</p>
                      <p className="text-sm text-slate-400">Status: {a.status}</p>
                    </div>
                    {a.score && <div className="text-lg font-bold text-indigo-400">{a.score}%</div>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-indigo-500/30 bg-indigo-950/10">
            <CardHeader>
              <CardTitle className="text-indigo-100">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {prediction?.recommendations ? (
                prediction.recommendations.map((rec: string, idx: number) => (
                  <div key={idx} className="p-4 rounded-lg border border-indigo-500/30 bg-indigo-500/5">
                    <p className="text-sm text-slate-300">{rec}</p>
                  </div>
                ))
              ) : (
                <div className="p-4 rounded-lg border border-slate-500/30 bg-slate-500/5">
                  <p className="text-sm text-slate-400">Loading recommendations...</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm border-l-2 border-indigo-500 pl-3">
                <p className="text-slate-200">New assignment posted in Calculus.</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
              <div className="text-sm border-l-2 border-emerald-500 pl-3">
                <p className="text-slate-200">Physics Lab Report graded.</p>
                <p className="text-xs text-slate-500">1 day ago</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <div className={`p-2 rounded-lg bg-slate-800/50 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">{value}</h2>
      </CardContent>
    </Card>
  );
}
