import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export function Insights() {
  const riskTrends = [
    { month: 'Sep', highRisk: 25, mediumRisk: 40, lowRisk: 35 },
    { month: 'Oct', highRisk: 22, mediumRisk: 38, lowRisk: 40 },
    { month: 'Nov', highRisk: 18, mediumRisk: 35, lowRisk: 47 },
    { month: 'Dec', highRisk: 15, mediumRisk: 30, lowRisk: 55 },
    { month: 'Jan', highRisk: 12, mediumRisk: 28, lowRisk: 60 },
  ];

  const strugglingSubjects = [
    { subject: 'Calculus', avgScore: 62 },
    { subject: 'Physics', avgScore: 68 },
    { subject: 'Data Structures', avgScore: 71 },
    { subject: 'Chemistry', avgScore: 74 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">AI Insights</h1>
        <p className="text-slate-400">Deep dive into machine learning predictions and trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Risk Trends Over Time</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Area type="monotone" dataKey="highRisk" stackId="1" stroke="#f87171" fill="#f87171" fillOpacity={0.6} name="High Risk" />
                <Area type="monotone" dataKey="mediumRisk" stackId="1" stroke="#fb923c" fill="#fb923c" fillOpacity={0.6} name="Medium Risk" />
                <Area type="monotone" dataKey="lowRisk" stackId="1" stroke="#34d399" fill="#34d399" fillOpacity={0.6} name="Low Risk" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Struggling Subjects</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strugglingSubjects} layout="vertical" margin={{ left: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <YAxis dataKey="subject" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }} cursor={{fill: '#334155', opacity: 0.4}} />
                <Bar dataKey="avgScore" fill="#fb923c" radius={[0, 4, 4, 0]} name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Importance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <p className="text-sm text-slate-400 mb-4">
                The Random Forest model relies on these key metrics to predict student risk levels.
              </p>
              
              <div className="space-y-4">
                <FeatureBar name="Average Marks" weight={40} color="bg-indigo-500" />
                <FeatureBar name="Attendance Percentage" weight={30} color="bg-emerald-500" />
                <FeatureBar name="Assignment Completion" weight={20} color="bg-orange-500" />
                <FeatureBar name="Participation Score" weight={10} color="bg-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Performance & Dropout Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Accuracy</p>
                  <p className="text-2xl font-bold text-white">94.2%</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Dropout Risk</p>
                  <p className="text-2xl font-bold text-red-400">High in CS</p>
                </div>
              </div>
              
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <h4 className="text-sm font-semibold text-indigo-400 mb-2">Model Status: Active</h4>
                <p className="text-xs text-slate-300">
                  The model was last trained on 10,000 historical student records using RandomForestClassifier.
                  It is currently predicting risk levels with high confidence.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function FeatureBar({ name, weight, color }: { name: string, weight: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300 font-medium">{name}</span>
        <span className="text-slate-400">{weight}%</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${weight}%` }}></div>
      </div>
    </div>
  );
}
