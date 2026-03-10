import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon } from 'lucide-react';

export function Timetable() {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  const [schedule, setSchedule] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', day: 'Monday', subject: '', time: '', teacher: '', room: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Mock dynamic data
    setSchedule([
      { id: 1, day: 'Monday', subject: 'Mathematics', time: '09:00 AM - 10:30 AM', teacher: 'Dr. Alan Turing', room: 'Room 101' },
      { id: 2, day: 'Monday', subject: 'Physics', time: '11:00 AM - 12:30 PM', teacher: 'Prof. Marie Curie', room: 'Lab 3' },
      { id: 3, day: 'Tuesday', subject: 'Computer Science', time: '10:00 AM - 11:30 AM', teacher: 'Dr. Alan Turing', room: 'Lab 1' },
      { id: 4, day: 'Wednesday', subject: 'English Literature', time: '01:00 PM - 02:30 PM', teacher: 'Mrs. Smith', room: 'Room 205' },
      { id: 5, day: 'Thursday', subject: 'Biology', time: '09:00 AM - 10:30 AM', teacher: 'Dr. Jane Goodall', room: 'Lab 2' },
      { id: 6, day: 'Friday', subject: 'History', time: '11:00 AM - 12:30 PM', teacher: 'Mr. Johnson', room: 'Room 302' },
    ]);
  }, []);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setSchedule(schedule.map(s => s.id === formData.id ? { ...formData } : s));
    } else {
      setSchedule([...schedule, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setFormData({ id: '', day: 'Monday', subject: '', time: '', teacher: '', room: '' });
    setIsEditing(false);
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setSchedule(schedule.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Weekly Timetable</h1>
        <p className="text-slate-400">View and manage the weekly class schedule.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            Class Schedule
          </CardTitle>
          {canEdit && (
            <button 
              onClick={() => {
                setFormData({ id: '', day: 'Monday', subject: '', time: '', teacher: '', room: '' });
                setIsEditing(false);
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Class
            </button>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Day</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Teacher</th>
                  <th className="px-4 py-3">Room</th>
                  {canEdit && <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {daysOfWeek.map(day => {
                  const dayClasses = schedule.filter(s => s.day === day).sort((a, b) => a.time.localeCompare(b.time));
                  const isToday = day === today;
                  
                  if (dayClasses.length === 0) return null;

                  return dayClasses.map((cls, index) => (
                    <tr key={cls.id} className={`border-b border-slate-800 transition-colors ${isToday ? 'bg-indigo-500/10 hover:bg-indigo-500/20' : 'hover:bg-slate-800/30'}`}>
                      {index === 0 ? (
                        <td className="px-4 py-3 font-medium text-slate-200" rowSpan={dayClasses.length}>
                          <div className="flex items-center gap-2">
                            {day}
                            {isToday && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500 text-white uppercase">Today</span>}
                          </div>
                        </td>
                      ) : null}
                      <td className="px-4 py-3 text-slate-300 font-medium">{cls.subject}</td>
                      <td className="px-4 py-3 text-slate-400">{cls.time}</td>
                      <td className="px-4 py-3 text-slate-400">{cls.teacher}</td>
                      <td className="px-4 py-3 text-slate-400">{cls.room}</td>
                      {canEdit && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => handleEdit(cls)} className="text-slate-400 hover:text-emerald-400 transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(cls.id)} className="text-slate-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ));
                })}
                {schedule.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 6 : 5} className="px-4 py-8 text-center text-slate-500">
                      No classes scheduled.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white">{isEditing ? 'Edit Class' : 'Add Class'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Day</label>
                <select required value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500">
                  {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                <input type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Time (e.g., 09:00 AM - 10:30 AM)</label>
                <input type="text" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Teacher</label>
                <input type="text" required value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Room</label>
                <input type="text" required value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">{isEditing ? 'Save Changes' : 'Add Class'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
