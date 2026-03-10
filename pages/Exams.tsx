import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';

export function Exams() {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'teacher';

  const [exams, setExams] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ id: '', subject: '', date: '', time: '', room: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Mock dynamic data
    const today = new Date();
    const futureDate1 = new Date(today); futureDate1.setDate(today.getDate() + 5);
    const futureDate2 = new Date(today); futureDate2.setDate(today.getDate() + 12);
    const pastDate = new Date(today); pastDate.setDate(today.getDate() - 10);

    setExams([
      { id: 1, subject: 'Mathematics Midterm', date: futureDate1.toISOString().split('T')[0], time: '09:00 AM - 11:00 AM', room: 'Main Hall' },
      { id: 2, subject: 'Physics Final', date: futureDate2.toISOString().split('T')[0], time: '01:00 PM - 03:00 PM', room: 'Lab 3' },
      { id: 3, subject: 'Computer Science Quiz', date: pastDate.toISOString().split('T')[0], time: '10:00 AM - 11:00 AM', room: 'Lab 1' },
    ]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      setExams(exams.map(s => s.id === formData.id ? { ...formData } : s));
    } else {
      setExams([...exams, { ...formData, id: Date.now() }]);
    }
    setIsModalOpen(false);
    setFormData({ id: '', subject: '', date: '', time: '', room: '' });
    setIsEditing(false);
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setExams(exams.filter(s => s.id !== id));
  };

  // Sort exams: upcoming first, then past
  const sortedExams = [...exams].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    const now = new Date().getTime();
    
    const isAUpcoming = dateA >= now;
    const isBUpcoming = dateB >= now;

    if (isAUpcoming && !isBUpcoming) return -1;
    if (!isAUpcoming && isBUpcoming) return 1;
    
    if (isAUpcoming) {
      return dateA - dateB; // Sort upcoming ascending
    } else {
      return dateB - dateA; // Sort past descending
    }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Exam Schedule</h1>
        <p className="text-slate-400">View upcoming and past examination dates.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Examinations
          </CardTitle>
          {canEdit && (
            <button 
              onClick={() => {
                setFormData({ id: '', subject: '', date: '', time: '', room: '' });
                setIsEditing(false);
                setIsModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Exam
            </button>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Subject</th>
                  <th className="px-4 py-3">Exam Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Status</th>
                  {canEdit && <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {sortedExams.map((exam) => {
                  const examDate = new Date(exam.date);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isUpcoming = examDate >= today;

                  return (
                    <tr key={exam.id} className={`border-b border-slate-800 transition-colors hover:bg-slate-800/30 ${!isUpcoming ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3 font-medium text-slate-200">{exam.subject}</td>
                      <td className="px-4 py-3 text-slate-300">{examDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="px-4 py-3 text-slate-400">{exam.time}</td>
                      <td className="px-4 py-3 text-slate-400">{exam.room}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          isUpcoming ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                          {isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                      </td>
                      {canEdit && (
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => handleEdit(exam)} className="text-slate-400 hover:text-emerald-400 transition-colors">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(exam.id)} className="text-slate-400 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
                {exams.length === 0 && (
                  <tr>
                    <td colSpan={canEdit ? 6 : 5} className="px-4 py-8 text-center text-slate-500">
                      No exams scheduled.
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
              <h2 className="text-xl font-semibold text-white">{isEditing ? 'Edit Exam' : 'Add Exam'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                <input type="text" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Exam Date</label>
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Time (e.g., 09:00 AM - 11:00 AM)</label>
                <input type="text" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Room</label>
                <input type="text" required value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">{isEditing ? 'Save Changes' : 'Add Exam'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
