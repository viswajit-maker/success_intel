import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { Search, Filter, CheckCircle, Clock, X, Upload, FileText } from 'lucide-react';

export function StudentAssignments() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  // Add form state
  const [newAssignment, setNewAssignment] = useState({
    name: '',
    subject: 'Mathematics',
    dueDate: '',
    description: ''
  });

  // Submit form state
  const [submitComments, setSubmitComments] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/student/assignments')
      .then(res => res.json())
      .then(data => {
        setAssignments(data);
        setLoading(false);
      });
  }, []);

  const filteredAssignments = assignments.filter(a => {
    if (subjectFilter !== 'All' && a.subject !== subjectFilter) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    return true;
  });

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const assignmentToAdd = {
      id: Date.now(),
      name: newAssignment.name,
      subject: newAssignment.subject,
      dueDate: newAssignment.dueDate,
      description: newAssignment.description,
      status: 'Pending',
      score: null,
      filename: null
    };
    setAssignments([assignmentToAdd, ...assignments]);
    setIsAddModalOpen(false);
    setNewAssignment({ name: '', subject: 'Mathematics', dueDate: '', description: '' });
  };

  const openSubmitModal = (assignment: any) => {
    setSelectedAssignment(assignment);
    setSubmitComments('');
    setSelectedFile(null);
    setUploadError('');
    setIsSubmitModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError('');
    
    // Check size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File exceeds 10MB limit.');
      return;
    }

    // Check type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip',
      'application/x-zip-compressed'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.zip')) {
      setUploadError('Invalid file type. Only PDF, DOCX, and ZIP are allowed.');
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    if (!selectedFile) {
      setUploadError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/upload-assignment', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setAssignments(assignments.map(a => 
        a.id === selectedAssignment.id 
          ? { ...a, status: 'Submitted', score: 'Awaiting Grade', filename: data.filename } 
          : a
      ));
      setIsSubmitModalOpen(false);
      setSelectedAssignment(null);
    } catch (error: any) {
      setUploadError(error.message || 'An error occurred during upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const openDetailsModal = (assignment: any) => {
    setSelectedAssignment(assignment);
    setIsDetailsModalOpen(true);
  };

  if (loading) return <div className="p-8 text-slate-400">Loading assignments...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Assignments</h1>
          <p className="text-slate-400">Manage your coursework and track submissions.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
        >
          Add Assignment
        </button>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>All Assignments</CardTitle>
          <div className="flex flex-wrap gap-3">
            <select 
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-[#0b1220] border border-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
            >
              <option value="All">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="English">English</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Chemistry">Chemistry</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0b1220] border border-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Submitted">Submitted</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Assignment Name</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Due Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3 rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">{assignment.name}</td>
                    <td className="px-4 py-3 text-slate-400">{assignment.subject}</td>
                    <td className="px-4 py-3 text-slate-300">{assignment.dueDate}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                        assignment.status === 'Submitted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                      }`}>
                        {assignment.status === 'Submitted' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {assignment.score !== null ? (typeof assignment.score === 'number' ? `${assignment.score}%` : assignment.score) : '--'}
                    </td>
                    <td className="px-4 py-3">
                      {assignment.status === 'Pending' ? (
                        <button 
                          onClick={() => openSubmitModal(assignment)}
                          className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium"
                        >
                          Submit
                        </button>
                      ) : (
                        <button 
                          onClick={() => openDetailsModal(assignment)}
                          className="text-slate-400 hover:text-slate-300 hover:underline"
                        >
                          View Details
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAssignments.length === 0 && (
              <div className="text-center py-8 text-slate-500">
                No assignments found matching your filters.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Assignment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white">Add New Assignment</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Assignment Name</label>
                <input 
                  type="text" required
                  value={newAssignment.name}
                  onChange={(e) => setNewAssignment({...newAssignment, name: e.target.value})}
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Chapter 4 Exercises"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                <select 
                  value={newAssignment.subject}
                  onChange={(e) => setNewAssignment({...newAssignment, subject: e.target.value})}
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="English">English</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Chemistry">Chemistry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                <input 
                  type="date" required
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                  style={{ colorScheme: 'dark' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea 
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({...newAssignment, description: e.target.value})}
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500 min-h-[80px]"
                  placeholder="Optional details..."
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Add Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Assignment Modal */}
      {isSubmitModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white">Submit Assignment</h2>
              <button onClick={() => setIsSubmitModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitAssignment} className="p-6 space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Submitting for:</p>
                <p className="font-medium text-white">{selectedAssignment.name} ({selectedAssignment.subject})</p>
              </div>
              
              <div 
                className={`border border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${
                  isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-600 bg-[#0b1220] hover:bg-slate-800/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx,.zip"
                />
                
                {selectedFile ? (
                  <div className="flex flex-col items-center text-center">
                    <FileText className="w-8 h-8 text-indigo-400 mb-2" />
                    <p className="text-sm font-medium text-white">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <>
                    <Upload className={`w-8 h-8 mb-2 ${isDragging ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <p className="text-sm font-medium text-slate-300">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">PDF, DOCX, or ZIP (max. 10MB)</p>
                  </>
                )}
              </div>
              
              {uploadError && (
                <p className="text-red-400 text-xs text-center">{uploadError}</p>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Comments (Optional)</label>
                <textarea 
                  value={submitComments}
                  onChange={(e) => setSubmitComments(e.target.value)}
                  className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500 min-h-[80px]"
                  placeholder="Add a note for your teacher..."
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsSubmitModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors" disabled={isUploading}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isDetailsModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-800">
              <h2 className="text-xl font-semibold text-white">Assignment Details</h2>
              <button onClick={() => setIsDetailsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white">{selectedAssignment.name}</h3>
                <p className="text-sm text-indigo-400">{selectedAssignment.subject}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0b1220] p-3 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Due Date</p>
                  <p className="text-sm font-medium text-slate-200">{selectedAssignment.dueDate}</p>
                </div>
                <div className="bg-[#0b1220] p-3 rounded-lg border border-slate-800">
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <span className={`flex items-center gap-1.5 text-sm font-medium w-fit ${
                    selectedAssignment.status === 'Submitted' ? 'text-emerald-400' : 'text-orange-400'
                  }`}>
                    {selectedAssignment.status === 'Submitted' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {selectedAssignment.status}
                  </span>
                </div>
              </div>

              <div className="bg-[#0b1220] p-3 rounded-lg border border-slate-800">
                <p className="text-xs text-slate-500 mb-1">Score</p>
                <p className="text-lg font-bold text-white">
                  {selectedAssignment.score !== null ? (typeof selectedAssignment.score === 'number' ? `${selectedAssignment.score}%` : selectedAssignment.score) : '--'}
                </p>
              </div>

              {selectedAssignment.description && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Description</p>
                  <p className="text-sm text-slate-300 leading-relaxed bg-[#0b1220] p-3 rounded-lg border border-slate-800">
                    {selectedAssignment.description}
                  </p>
                </div>
              )}

              {selectedAssignment.filename && (
                <div>
                  <p className="text-xs text-slate-500 mb-2">Submitted File</p>
                  <a 
                    href={`/uploads/${selectedAssignment.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-medium truncate">{selectedAssignment.filename.split('-').slice(1).join('-')}</span>
                  </a>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button onClick={() => setIsDetailsModalOpen(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
