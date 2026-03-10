import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Search, Filter, Star } from 'lucide-react';

export function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/teachers')
      .then(res => res.json())
      .then(data => {
        setTeachers(data);
        setLoading(false);
      });
  }, []);

  const filteredTeachers = teachers.filter(t => {
    if (departmentFilter !== 'All' && t.department !== departmentFilter) return false;
    if (searchQuery && !t.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="p-8 text-slate-400">Loading teachers...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Faculty Management</h1>
        <p className="text-slate-400">Manage teaching staff, view performance ratings, and assign subjects.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>All Teachers</CardTitle>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search teachers..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-[#0b1220] border border-slate-700 rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>
            <select 
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="bg-[#0b1220] border border-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
            >
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
            </select>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
              Add Teacher
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Teacher Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Subjects</th>
                  <th className="px-4 py-3">Students</th>
                  <th className="px-4 py-3">Performance Rating</th>
                  <th className="px-4 py-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">{teacher.name}</td>
                    <td className="px-4 py-3 text-slate-400">{teacher.department}</td>
                    <td className="px-4 py-3 text-slate-300">{teacher.subjects}</td>
                    <td className="px-4 py-3 text-slate-300">{teacher.students}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-emerald-400 font-medium">
                        <Star className="w-4 h-4 fill-emerald-400" />
                        {teacher.rating}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredTeachers.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No teachers found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
