import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { Download, FileText, Filter } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function Reports() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [reportType, setReportType] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  
  const [generatedReport, setGeneratedReport] = useState<{
    title: string;
    columns: string[];
    data: any[][];
  } | null>(null);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching students:', err);
        setLoading(false);
      });
  }, []);

  const adminReports = [
    'End-of-Term Summary',
    'Department Performance',
    'At-Risk Students',
    'Attendance Analytics'
  ];

  const teacherReports = [
    'Class Performance',
    'Student Risk Report',
    'Assignment Completion'
  ];

  const availableReports = user?.role === 'admin' ? adminReports : teacherReports;

  // Set default report type
  useEffect(() => {
    if (!reportType && availableReports.length > 0) {
      setReportType(availableReports[0]);
    }
  }, [user, availableReports, reportType]);

  const handleGenerateReport = () => {
    if (!students.length) return;

    let filteredStudents = students;
    if (departmentFilter !== 'All') {
      filteredStudents = filteredStudents.filter(s => s.department === departmentFilter);
    }
    if (riskFilter !== 'All') {
      filteredStudents = filteredStudents.filter(s => s.risk_level === riskFilter);
    }

    let columns: string[] = [];
    let data: any[][] = [];

    switch (reportType) {
      case 'End-of-Term Summary':
      case 'Class Performance':
        columns = ['Student Name', 'Department', 'Attendance (%)', 'Average Marks (%)', 'Risk Level'];
        data = filteredStudents.map(s => [
          s.name, s.department, s.attendance_percentage, s.average_marks, s.risk_level
        ]);
        break;
      
      case 'Department Performance':
        columns = ['Department', 'Total Students', 'Average Score', 'High Risk Students'];
        const deptStats: Record<string, any> = {};
        filteredStudents.forEach(s => {
          if (!deptStats[s.department]) {
            deptStats[s.department] = { count: 0, totalScore: 0, highRisk: 0 };
          }
          deptStats[s.department].count += 1;
          deptStats[s.department].totalScore += s.average_marks;
          if (s.risk_level === 'High Risk') deptStats[s.department].highRisk += 1;
        });
        data = Object.keys(deptStats).map(dept => [
          dept,
          deptStats[dept].count,
          (deptStats[dept].totalScore / deptStats[dept].count).toFixed(1),
          deptStats[dept].highRisk
        ]);
        break;

      case 'At-Risk Students':
        const atRisk = filteredStudents.filter(s => s.risk_level === 'High Risk' || s.risk_level === 'Medium Risk');
        columns = ['Student Name', 'Department', 'Attendance (%)', 'Average Marks (%)', 'Risk Level'];
        data = atRisk.map(s => [
          s.name, s.department, s.attendance_percentage, s.average_marks, s.risk_level
        ]);
        break;

      case 'Attendance Analytics':
        columns = ['Student Name', 'Department', 'Attendance (%)', 'Risk Level'];
        data = filteredStudents.map(s => [
          s.name, s.department, s.attendance_percentage, s.risk_level
        ]);
        break;

      case 'Student Risk Report':
        columns = ['Student Name', 'Attendance (%)', 'Marks (%)', 'Assignment Completion (%)', 'Risk Level'];
        data = filteredStudents.map(s => [
          s.name, s.attendance_percentage, s.average_marks, s.assignment_completion_rate, s.risk_level
        ]);
        break;

      case 'Assignment Completion':
        columns = ['Student Name', 'Department', 'Assignment Completion (%)', 'Risk Level'];
        data = filteredStudents.map(s => [
          s.name, s.department, s.assignment_completion_rate, s.risk_level
        ]);
        break;
    }

    setGeneratedReport({
      title: reportType,
      columns,
      data
    });
  };

  const exportPDF = () => {
    if (!generatedReport) return;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(generatedReport.title, 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Department Filter: ${departmentFilter} | Risk Filter: ${riskFilter}`, 14, 36);

    autoTable(doc, {
      startY: 45,
      head: [generatedReport.columns],
      body: generatedReport.data,
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [79, 70, 229] } // Indigo-600
    });

    doc.save(`${generatedReport.title.replace(/\s+/g, '_')}.pdf`);
  };

  const exportCSV = () => {
    if (!generatedReport) return;
    
    const headers = generatedReport.columns.join(',');
    const rows = generatedReport.data.map(row => row.join(','));
    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${generatedReport.title.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const departments = ['All', 'Computer Science', 'Engineering', 'Business', 'Arts', 'Science'];
  const riskLevels = ['All', 'Low Risk', 'Medium Risk', 'High Risk'];

  if (loading) return <div className="p-8 text-slate-400">Loading data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Reports & Exports</h1>
        <p className="text-slate-400">Generate and download comprehensive academic reports.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-400" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Report Type</label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {availableReports.map(report => (
                  <option key={report} value={report}>{report}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
              <select 
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Risk Level</label>
              <select 
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                {riskLevels.map(risk => (
                  <option key={risk} value={risk}>{risk}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button 
              onClick={handleGenerateReport}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              Generate Report
            </button>
          </div>
        </CardContent>
      </Card>

      {generatedReport && (
        <Card className="animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <CardTitle>{generatedReport.title}</CardTitle>
              <p className="text-sm text-slate-400 mt-1">
                Showing {generatedReport.data.length} results
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={exportCSV}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                Export CSV
              </button>
              <button 
                onClick={exportPDF}
                className="flex items-center gap-2 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20 border border-emerald-500/20 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                  <tr>
                    {generatedReport.columns.map((col, i) => (
                      <th key={i} className="px-6 py-4 font-medium">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {generatedReport.data.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      {row.map((cell, j) => (
                        <td key={j} className="px-6 py-4 text-slate-300">
                          {j === generatedReport.columns.indexOf('Risk Level') ? (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              cell === 'High Risk' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                              cell === 'Medium Risk' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                              'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {generatedReport.data.length === 0 && (
                    <tr>
                      <td colSpan={generatedReport.columns.length} className="px-6 py-8 text-center text-slate-500">
                        No data found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
