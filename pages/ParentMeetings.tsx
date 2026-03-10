import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Calendar, Clock, Video, User } from 'lucide-react';

export function ParentMeetings() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [teacher, setTeacher] = useState('Mr. Anderson (Calculus)');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingType, setMeetingType] = useState('Video Call');
  const [reason, setReason] = useState('');
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    fetch('/api/parent/meetings')
      .then(res => res.json())
      .then(data => {
        setMeetings(data);
        setLoading(false);
      });
  }, []);

  const handleRequestMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meetingDate) {
      setDateError(true);
      return;
    }
    setDateError(false);

    // Extract teacher name and subject from the select value
    const teacherName = teacher.split(' (')[0];
    const subjectMatch = teacher.match(/\(([^)]+)\)/);
    const subject = subjectMatch ? subjectMatch[1] : 'General';

    const newMeeting = {
      id: Date.now(),
      teacher: teacherName,
      subject: subject,
      date: meetingDate,
      time: 'TBD',
      type: meetingType,
      status: 'Pending'
    };
    
    setMeetings([newMeeting, ...meetings]);
    setShowForm(false);
    
    // Reset form
    setTeacher('Mr. Anderson (Calculus)');
    setMeetingDate('');
    setMeetingType('Video Call');
    setReason('');
  };

  if (loading) return <div className="p-8 text-slate-400">Loading meetings...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Teacher Meetings</h1>
          <p className="text-slate-400">Schedule and manage appointments with your child's teachers.</p>
        </div>
        <button 
          onClick={() => {
            setShowForm(!showForm);
            setDateError(false);
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          {showForm ? 'Cancel' : 'Request Meeting'}
        </button>
      </div>

      {showForm && (
        <Card className="bg-indigo-950/10 border-indigo-500/30">
          <CardHeader>
            <CardTitle>Request a New Meeting</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleRequestMeeting}>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Teacher</label>
                <select 
                  value={teacher}
                  onChange={(e) => setTeacher(e.target.value)}
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>Mr. Anderson (Calculus)</option>
                  <option>Ms. Davis (Physics)</option>
                  <option>Mrs. Smith (English)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Preferred Date</label>
                <input 
                  type="date" 
                  value={meetingDate}
                  onChange={(e) => {
                    setMeetingDate(e.target.value);
                    if (e.target.value) setDateError(false);
                  }}
                  className={`w-full bg-[#0b1220] border rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500 ${
                    dateError ? 'border-red-500' : 'border-slate-700'
                  }`}
                  style={{ colorScheme: 'dark' }}
                />
                {dateError && (
                  <p className="text-red-400 text-xs mt-1">Please select a meeting date.</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Meeting Type</label>
                <select 
                  value={meetingType}
                  onChange={(e) => setMeetingType(e.target.value)}
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option>Video Call</option>
                  <option>In-Person</option>
                  <option>Phone Call</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Reason for Meeting</label>
                <input 
                  type="text" 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Brief description..." 
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" 
                />
              </div>
              <div className="md:col-span-2 flex justify-end mt-2">
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Submit Request
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div key={meeting.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700 gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${
                    meeting.status === 'Scheduled' ? 'bg-emerald-500/20 text-emerald-400' :
                    meeting.status === 'Pending' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {meeting.type === 'Video Call' ? <Video className="w-6 h-6" /> : <User className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-200">{meeting.teacher}</h4>
                    <p className="text-sm text-slate-400">{meeting.subject}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {meeting.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {meeting.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    meeting.status === 'Scheduled' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    meeting.status === 'Pending' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                    'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {meeting.status}
                  </span>
                  {meeting.status === 'Scheduled' && meeting.type === 'Video Call' && (
                    <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">Join Call</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
