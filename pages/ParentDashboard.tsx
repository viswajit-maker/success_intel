import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Bell, Calendar, BookOpen, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DEMO_ATTENDANCE = [
  { date: 'Oct 1', status: 'Present', value: 1 },
  { date: 'Oct 2', status: 'Present', value: 1 },
  { date: 'Oct 3', status: 'Absent', value: 0 },
  { date: 'Oct 4', status: 'Present', value: 1 },
  { date: 'Oct 5', status: 'Present', value: 1 },
  { date: 'Oct 6', status: 'Absent', value: 0 },
];

export function ParentDashboard() {
  const [attendance, setAttendance] = useState<any[]>(DEMO_ATTENDANCE);
  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    // Fetch real data if available, otherwise keep demo data
    fetch('/api/attendance').then(res => res.json()).then(data => {
      if (data && data.length > 0) {
        // Map data to match BarChart format if necessary, or just use it
        // setAttendance(data);
      }
    }).catch(() => {});
    
    // Simulate getting prediction for the child
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const isPresent = payload[0].value === 1;
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-md shadow-lg">
          <p className="text-slate-200 font-medium mb-1">{label}</p>
          <p className={`text-sm font-bold ${isPresent ? 'text-emerald-400' : 'text-red-400'}`}>
            {isPresent ? 'Present' : 'Absent'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Parent Portal</h1>
        <p className="text-slate-400">Track your child's academic progress and attendance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Overall Score" value={prediction?.ssis_score || '--'} icon={Activity} color="text-indigo-400" />
        <MetricCard title="Attendance" value="82%" icon={Bell} color="text-emerald-400" />
        <MetricCard title="Upcoming Assignments" value="2" icon={BookOpen} color="text-orange-400" />
        <MetricCard title="Next Meeting" value="Oct 15" icon={Calendar} color="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Attendance History</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 1]} 
                    ticks={[0, 1]} 
                    tickFormatter={(val) => val === 1 ? 'Present' : 'Absent'}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#334155', opacity: 0.4}} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {attendance.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.value === 1 ? '#10b981' : '#f87171'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Progress Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div>
                    <p className="font-medium text-slate-200">Midterm Report Card</p>
                    <p className="text-sm text-slate-400">Fall Semester 2023</p>
                  </div>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">Download PDF</button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-red-500/30 bg-red-950/10">
            <CardHeader>
              <CardTitle className="text-red-100">Attendance Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
                <h4 className="text-sm font-semibold mb-1 text-red-400">Missed Class</h4>
                <p className="text-xs text-slate-300">Your child missed Calculus on Tuesday, Oct 10th.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule Meeting</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">Book a 1-on-1 session with your child's teachers.</p>
              <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
                Request Appointment
              </button>
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
