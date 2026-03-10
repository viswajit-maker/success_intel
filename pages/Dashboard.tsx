import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { TrendingUp, TrendingDown, Users, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function Dashboard() {
  const [stats, setStats] = useState({
    overallScore: 0,
    highRisk: 0,
    mediumRisk: 0,
    highSuccess: 0
  });

  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data));

    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data.slice(0, 10))); // Get top 10 for table
  }, []);

  const attendanceData = [
    { name: 'Week 1', attendance: 85 },
    { name: 'Week 2', attendance: 82 },
    { name: 'Week 3', attendance: 88 },
    { name: 'Week 4', attendance: 80 },
    { name: 'Week 5', attendance: 75 },
    { name: 'Week 6', attendance: 78 },
    { name: 'Week 7', attendance: 84 },
  ];

  const departmentData = [
    { name: 'CS', risk: 12, success: 45 },
    { name: 'Eng', risk: 18, success: 38 },
    { name: 'Bus', risk: 8, success: 52 },
    { name: 'Arts', risk: 5, success: 30 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Institutional Success Dashboard</h1>
        <p className="text-slate-400">Overview of campus-wide student success metrics and AI insights.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Overall Success Score" 
          value={stats.overallScore} 
          icon={Activity} 
          trend="+2.4%" 
          trendUp={true} 
          color="text-indigo-400" 
        />
        <MetricCard 
          title="High Risk Students" 
          value={stats.highRisk} 
          icon={AlertTriangle} 
          trend="-5.1%" 
          trendUp={false} 
          color="text-red-400" 
        />
        <MetricCard 
          title="Medium Risk Students" 
          value={stats.mediumRisk} 
          icon={TrendingDown} 
          trend="+1.2%" 
          trendUp={false} 
          color="text-orange-400" 
        />
        <MetricCard 
          title="High Success Students" 
          value={stats.highSuccess} 
          icon={CheckCircle} 
          trend="+8.4%" 
          trendUp={true} 
          color="text-emerald-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campus Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData}>
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                      itemStyle={{ color: '#818cf8' }}
                    />
                    <Area type="monotone" dataKey="attendance" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorAttendance)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk by Department</CardTitle>
              </CardHeader>
              <CardContent className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                      cursor={{fill: '#334155', opacity: 0.4}}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                    <Bar dataKey="risk" name="At Risk" fill="#f87171" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="success" name="Success" fill="#34d399" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Student Risk Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Student Risk Watchlist</CardTitle>
              <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">View All</button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Student Name</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Risk Level</th>
                      <th className="px-4 py-3">Attendance</th>
                      <th className="px-4 py-3">Latest Marks</th>
                      <th className="px-4 py-3 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-200">{student.name}</td>
                        <td className="px-4 py-3 text-slate-400">{student.department}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            student.risk_level === 'High Risk' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            student.risk_level === 'Medium Risk' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {student.risk_level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{student.attendance_percentage}%</td>
                        <td className="px-4 py-3 text-slate-300">{student.average_marks}%</td>
                        <td className="px-4 py-3">
                          <button className="text-indigo-400 hover:text-indigo-300 hover:underline">Review</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Panel */}
        <div className="space-y-6">
          <Card className="border-indigo-500/30 bg-indigo-950/10">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/20 rounded-md">
                  <Activity className="w-5 h-5 text-indigo-400" />
                </div>
                <CardTitle className="text-indigo-100">AI Insights & Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <InsightCard 
                title="Attendance Dip Alert" 
                desc="15 students in CS101 have shown a 20% drop in attendance over the last two weeks."
                type="warning"
              />
              <InsightCard 
                title="Midterm Performance Alert" 
                desc="70% of students scored low in Calculus — revisit topic before finals."
                type="danger"
              />
              <InsightCard 
                title="Retention Opportunity" 
                desc="5 'Medium Risk' students have improved assignment completion. Positive reinforcement recommended."
                type="success"
              />
              <InsightCard 
                title="Engagement Drop" 
                desc="Overall participation score down by 8% across Engineering department."
                type="warning"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon: Icon, trend, trendUp, color }: any) {
  return (
    <Card>
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <div className={`p-2 rounded-lg bg-slate-800/50 ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl font-bold text-white">{value}</h2>
          <span className={`text-xs font-medium ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {trend}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({ title, desc, type }: any) {
  const colors = {
    warning: 'border-orange-500/30 bg-orange-500/5',
    danger: 'border-red-500/30 bg-red-500/5',
    success: 'border-emerald-500/30 bg-emerald-500/5',
  };
  
  const textColors = {
    warning: 'text-orange-400',
    danger: 'text-red-400',
    success: 'text-emerald-400',
  };

  return (
    <div className={`p-4 rounded-lg border ${colors[type as keyof typeof colors]} transition-all hover:bg-opacity-10`}>
      <h4 className={`text-sm font-semibold mb-1 ${textColors[type as keyof typeof textColors]}`}>{title}</h4>
      <p className="text-xs text-slate-300 leading-relaxed">{desc}</p>
    </div>
  );
}
