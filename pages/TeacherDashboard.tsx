import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Users, AlertTriangle, BookOpen, Activity, BrainCircuit } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function TeacherDashboard() {
  const [students, setStudents] = useState<any[]>([]);
  const [predictions, setPredictions] = useState<Record<number, any>>({});
  const [loadingPrediction, setLoadingPrediction] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data.filter((s: any) => s.risk_level !== 'Low Risk').slice(0, 5)));
  }, []);

  const runPrediction = async (student: any) => {
    setLoadingPrediction(student.id);
    try {
      const res = await fetch('/api/predict-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attendance_percentage: student.attendance_percentage,
          average_marks: student.average_marks,
          assignment_completion_rate: student.assignment_completion_rate,
          participation_score: student.participation_score
        })
      });
      const data = await res.json();
      setPredictions(prev => ({ ...prev, [student.id]: data }));
    } catch (error) {
      console.error("Failed to run prediction", error);
    } finally {
      setLoadingPrediction(null);
    }
  };

  const classPerformance = [
    { topic: 'Algebra', score: 85 },
    { topic: 'Geometry', score: 78 },
    { topic: 'Calculus', score: 62 },
    { topic: 'Statistics', score: 88 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Teacher Dashboard</h1>
        <p className="text-slate-400">Class performance analytics and student risk alerts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard title="Total Students" value="120" icon={Users} color="text-indigo-400" />
        <MetricCard title="At-Risk Students" value={students.length} icon={AlertTriangle} color="text-red-400" />
        <MetricCard title="Avg Class Score" value="76%" icon={Activity} color="text-emerald-400" />
        <MetricCard title="Assignments Pending" value="15" icon={BookOpen} color="text-orange-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Class Performance by Topic</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="topic" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} cursor={{fill: '#334155', opacity: 0.4}} />
                  <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weak Students List & AI Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Student Name</th>
                      <th className="px-4 py-3">Risk Level</th>
                      <th className="px-4 py-3">AI Prediction</th>
                      <th className="px-4 py-3 rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-200">{student.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            student.risk_level === 'High Risk' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                          }`}>
                            {student.risk_level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {predictions[student.id] ? (
                            <div className="flex flex-col gap-1">
                              <span className="text-indigo-400 font-medium">Score: {predictions[student.id].ssis_score}</span>
                              <span className="text-xs text-slate-400">Conf: {predictions[student.id].confidence}</span>
                            </div>
                          ) : (
                            <span className="text-slate-500 italic">Not run</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button 
                            onClick={() => runPrediction(student)}
                            disabled={loadingPrediction === student.id}
                            className="flex items-center gap-1.5 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
                          >
                            <BrainCircuit className="w-4 h-4" />
                            {loadingPrediction === student.id ? 'Predicting...' : 'Run AI'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-orange-500/30 bg-orange-950/10">
            <CardHeader>
              <CardTitle className="text-orange-100">Topic Difficulty Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-orange-500/30 bg-orange-500/5">
                <h4 className="text-sm font-semibold mb-1 text-orange-400">Calculus Alert</h4>
                <p className="text-xs text-slate-300">70% of students scored low in Calculus — revisit topic before the next assessment.</p>
              </div>
            </CardContent>
          </Card>
          
          {Object.keys(predictions).length > 0 && (
            <Card className="border-indigo-500/30 bg-indigo-950/10">
              <CardHeader>
                <CardTitle className="text-indigo-100">Latest AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.values(predictions).slice(-2).map((pred: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-lg border border-indigo-500/30 bg-indigo-500/5">
                    <h4 className="text-sm font-semibold mb-1 text-indigo-400">Risk: {pred.risk_level}</h4>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                      {pred.recommendations?.map((rec: string, i: number) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
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
