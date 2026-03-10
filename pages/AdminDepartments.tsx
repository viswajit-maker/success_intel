import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Users, BookOpen, Activity, AlertTriangle } from 'lucide-react';

const DEMO_DEPARTMENTS = [
  { name: 'Computer Science', students: 120, avgScore: 82, highRisk: 10 },
  { name: 'Engineering', students: 150, avgScore: 78, highRisk: 15 },
  { name: 'Business', students: 90, avgScore: 85, highRisk: 5 },
];

export function AdminDepartments() {
  const [departments, setDepartments] = useState<any[]>(DEMO_DEPARTMENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/departments')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.departments)) {
          // If the backend returns the full object structure
          // setDepartments(data.departments);
        } else if (Array.isArray(data)) {
          // If the backend returns just an array
          // setDepartments(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-slate-400">Loading departments...</div>;

  const totalStudents = departments.reduce((acc, dept) => acc + dept.students, 0);
  const avgScore = Math.round(departments.reduce((acc, dept) => acc + dept.avgScore, 0) / departments.length) || 0;
  const totalHighRisk = departments.reduce((acc, dept) => acc + dept.highRisk, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Department Analytics</h1>
        <p className="text-slate-400">Institutional performance broken down by academic departments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total Departments" value={departments.length} icon={BookOpen} color="text-indigo-400" />
        <MetricCard title="Total Students" value={totalStudents.toLocaleString()} icon={Users} color="text-emerald-400" />
        <MetricCard title="Avg. Score" value={`${avgScore}%`} icon={Activity} color="text-blue-400" />
        <MetricCard title="High Risk Students" value={totalHighRisk} icon={AlertTriangle} color="text-red-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Average Score by Department</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} cursor={{fill: '#334155', opacity: 0.4}} />
                <Bar dataKey="avgScore" fill="#6366f1" radius={[4, 4, 0, 0]} name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Department Name</th>
                  <th className="px-4 py-3">Total Students</th>
                  <th className="px-4 py-3">Average Score</th>
                  <th className="px-4 py-3 rounded-tr-lg">High Risk Students</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, i) => (
                  <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">{dept.name}</td>
                    <td className="px-4 py-3 text-slate-300">{dept.students}</td>
                    <td className="px-4 py-3 text-slate-300">{dept.avgScore}%</td>
                    <td className="px-4 py-3 text-red-400 font-medium">{dept.highRisk}</td>
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
