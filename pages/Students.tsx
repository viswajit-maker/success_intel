import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { X, Edit2, Trash2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Students() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const [students, setStudents] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Form states
  const initialFormState = {
    name: '',
    id: '',
    department: '',
    year: '',
    email: '',
    attendance: '',
    marks: '',
    assignments: '',
    participation: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        // Map backend data to our frontend structure if needed, or just use it directly
        // The backend has attendance_percentage, average_marks, assignment_completion_rate, participation_score
        const formattedData = data.map((s: any) => ({
          ...s,
          studentId: s.id.toString().padStart(6, '0'), // Mock ID
          year: Math.floor(Math.random() * 4) + 1, // Mock year
          email: `${s.name.toLowerCase().replace(' ', '.')}@example.com`, // Mock email
          assignments: s.assignment_completion_rate,
          participation: s.participation_score,
          attendance: s.attendance_percentage,
          marks: s.average_marks
        }));
        setStudents(formattedData);
      });
  }, []);

  const calculateSSIS = (attendance: number, marks: number, assignments: number, participation: number) => {
    const ssis = (0.30 * attendance) + (0.40 * marks) + (0.20 * assignments) + (0.10 * participation);
    
    let riskLevel = 'High Risk';
    if (ssis > 80) riskLevel = 'Low Risk';
    else if (ssis >= 60) riskLevel = 'Medium Risk';
    
    return { ssis: parseFloat(ssis.toFixed(1)), riskLevel };
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const att = parseFloat(formData.attendance) || 0;
    const mrk = parseFloat(formData.marks) || 0;
    const asm = parseFloat(formData.assignments) || 0;
    const prt = parseFloat(formData.participation) || 0;
    
    const { ssis, riskLevel } = calculateSSIS(att, mrk, asm, prt);
    
    const newStudent = {
      id: Date.now(),
      studentId: formData.id || `STU${Math.floor(Math.random() * 10000)}`,
      name: formData.name,
      department: formData.department,
      year: formData.year,
      email: formData.email,
      attendance: att,
      marks: mrk,
      assignments: asm,
      participation: prt,
      ssis_score: ssis,
      risk_level: riskLevel
    };
    
    setStudents([newStudent, ...students]);
    setIsAddModalOpen(false);
    setFormData(initialFormState);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    const att = parseFloat(formData.attendance) || 0;
    const mrk = parseFloat(formData.marks) || 0;
    const asm = parseFloat(formData.assignments) || 0;
    const prt = parseFloat(formData.participation) || 0;
    
    const { ssis, riskLevel } = calculateSSIS(att, mrk, asm, prt);
    
    const updatedStudents = students.map(s => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          name: formData.name,
          studentId: formData.id,
          department: formData.department,
          year: formData.year,
          email: formData.email,
          attendance: att,
          marks: mrk,
          assignments: asm,
          participation: prt,
          ssis_score: ssis,
          risk_level: riskLevel
        };
      }
      return s;
    });
    
    setStudents(updatedStudents);
    setIsEditModalOpen(false);
    setSelectedStudent(null);
  };

  const handleDeleteConfirm = () => {
    if (!selectedStudent) return;
    setStudents(students.filter(s => s.id !== selectedStudent.id));
    setIsDeleteModalOpen(false);
    setSelectedStudent(null);
  };

  const openEditModal = (student: any) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      id: student.studentId || '',
      department: student.department,
      year: student.year?.toString() || '',
      email: student.email || '',
      attendance: student.attendance?.toString() || '',
      marks: student.marks?.toString() || '',
      assignments: student.assignments?.toString() || '',
      participation: student.participation?.toString() || ''
    });
    setIsEditModalOpen(true);
  };

  const openProfileModal = (student: any) => {
    setSelectedStudent(student);
    setIsProfileModalOpen(true);
  };

  const openDeleteModal = (student: any) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const filteredStudents = students.filter(student => {
    const query = searchQuery.toLowerCase();
    return (
      student.name.toLowerCase().includes(query) ||
      student.department.toLowerCase().includes(query) ||
      student.risk_level.toLowerCase().includes(query) ||
      (student.studentId && student.studentId.toLowerCase().includes(query))
    );
  });

  const renderStudentForm = (onSubmit: (e: React.FormEvent) => void, title: string, onCancel: () => void) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-[#0f172a] rounded-t-xl z-10">
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-indigo-400 uppercase tracking-wider">Basic Info</h3>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Student Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Student ID</label>
                <input type="text" required value={formData.id} onChange={(e) => setFormData({...formData, id: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Department</label>
                <input type="text" required value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Year / Class</label>
                <input type="text" required value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-indigo-400 uppercase tracking-wider">Performance Metrics</h3>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Attendance (%)</label>
                <input type="number" required min="0" max="100" value={formData.attendance} onChange={(e) => setFormData({...formData, attendance: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Marks (%)</label>
                <input type="number" required min="0" max="100" value={formData.marks} onChange={(e) => setFormData({...formData, marks: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Assignment Completion (%)</label>
                <input type="number" required min="0" max="100" value={formData.assignments} onChange={(e) => setFormData({...formData, assignments: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Participation Score (%)</label>
                <input type="number" required min="0" max="100" value={formData.participation} onChange={(e) => setFormData({...formData, participation: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-[#0f172a] rounded-b-xl">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">Save Student</button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Student Management</h1>
        <p className="text-slate-400">View and manage all students across departments.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>All Students</CardTitle>
          <div className="flex gap-2 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search students..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-auto bg-[#0b1220] border border-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
            />
            <button 
              onClick={() => {
                setFormData(initialFormState);
                setIsAddModalOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap"
            >
              Add Student
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Student Name</th>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Risk Level</th>
                  <th className="px-4 py-3">SSIS</th>
                  <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                          {student.name.charAt(0)}
                        </div>
                        {student.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{student.studentId}</td>
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
                    <td className="px-4 py-3 text-slate-300 font-medium">{student.ssis_score}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => openProfileModal(student)} className="text-slate-400 hover:text-indigo-400 transition-colors" title="View Profile">
                          <User className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <>
                            <button onClick={() => openEditModal(student)} className="text-slate-400 hover:text-emerald-400 transition-colors" title="Edit Student">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => openDeleteModal(student)} className="text-slate-400 hover:text-red-400 transition-colors" title="Delete Student">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No students found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Student Modal */}
      {isAddModalOpen && renderStudentForm(handleAddSubmit, "Add New Student", () => setIsAddModalOpen(false))}

      {/* Edit Student Modal */}
      {isEditModalOpen && renderStudentForm(handleEditSubmit, "Edit Student", () => setIsEditModalOpen(false))}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-2">Delete Student</h2>
              <p className="text-slate-400 mb-6">Are you sure you want to delete <span className="text-white font-medium">{selectedStudent.name}</span>? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleDeleteConfirm} className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 px-4 py-2 rounded-md text-sm font-medium transition-colors">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {isProfileModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl font-bold">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">{selectedStudent.name}</h2>
                  <p className="text-sm text-slate-400">{selectedStudent.studentId} • {selectedStudent.department}</p>
                </div>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#0b1220] p-4 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Attendance</p>
                  <p className="text-xl font-bold text-white">{selectedStudent.attendance}%</p>
                </div>
                <div className="bg-[#0b1220] p-4 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Marks</p>
                  <p className="text-xl font-bold text-white">{selectedStudent.marks}%</p>
                </div>
                <div className="bg-[#0b1220] p-4 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Assignments</p>
                  <p className="text-xl font-bold text-white">{selectedStudent.assignments}%</p>
                </div>
                <div className="bg-[#0b1220] p-4 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Participation</p>
                  <p className="text-xl font-bold text-white">{selectedStudent.participation}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-[#0b1220] p-4 rounded-lg border border-slate-800">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Success Intelligence Score (SSIS)</p>
                  <p className="text-2xl font-bold text-white">{selectedStudent.ssis_score}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400 mb-1">Current Status</p>
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    selectedStudent.risk_level === 'High Risk' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    selectedStudent.risk_level === 'Medium Risk' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {selectedStudent.risk_level}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Email Address</p>
                  <p className="text-slate-300">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Year / Class</p>
                  <p className="text-slate-300">Year {selectedStudent.year}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
