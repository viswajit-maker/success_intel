import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, ExternalLink, Bookmark, BookmarkCheck, Briefcase, Filter, Search } from 'lucide-react';

export function CareerHub() {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    type: 'Course',
    platform: '',
    category: 'Web Development',
    skills: '',
    description: '',
    externalLink: ''
  });

  useEffect(() => {
    // Mock data
    setOpportunities([
      {
        id: 1,
        title: 'Machine Learning Specialization',
        type: 'Course',
        platform: 'Coursera',
        category: 'AI',
        skills: ['Python', 'TensorFlow', 'Machine Learning'],
        description: 'A foundational online program created by deeplearning.ai and Stanford Online.',
        externalLink: 'https://www.coursera.org'
      },
      {
        id: 2,
        title: 'Frontend Developer Intern',
        type: 'Internship',
        platform: 'Internshala',
        category: 'Web Development',
        skills: ['React', 'TypeScript', 'Tailwind CSS'],
        description: 'Join our fast-paced startup to build modern web applications and learn from senior engineers.',
        externalLink: 'https://internshala.com'
      },
      {
        id: 3,
        title: 'AWS Certified Solutions Architect',
        type: 'Certification',
        platform: 'AWS Certifications',
        category: 'Cloud',
        skills: ['AWS', 'Cloud Architecture', 'Security'],
        description: 'Validate your technical skills and cloud expertise to grow your career and business.',
        externalLink: 'https://aws.amazon.com/certification/'
      },
      {
        id: 4,
        title: 'Data Science Bootcamp',
        type: 'Course',
        platform: 'Udemy',
        category: 'Data Science',
        skills: ['Data Analysis', 'Pandas', 'SQL'],
        description: 'Complete data science training: Mathematics, Statistics, Python, Advanced Statistics in Python.',
        externalLink: 'https://www.udemy.com'
      },
      {
        id: 5,
        title: 'Cybersecurity Analyst Intern',
        type: 'Internship',
        platform: 'LinkedIn Jobs',
        category: 'Cybersecurity',
        skills: ['Network Security', 'Ethical Hacking', 'Linux'],
        description: 'Assist in monitoring network traffic for security events and investigate potential incidents.',
        externalLink: 'https://www.linkedin.com/jobs'
      },
      {
        id: 6,
        title: 'Google Cloud Professional Developer',
        type: 'Certification',
        platform: 'Google Cloud Skills',
        category: 'Cloud',
        skills: ['GCP', 'Kubernetes', 'Cloud Native'],
        description: 'Demonstrate your proficiency in designing, building, and managing cloud-native applications.',
        externalLink: 'https://cloud.google.com/certification'
      }
    ]);
  }, []);

  const handleSaveToggle = (id: number) => {
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter(savedId => savedId !== id));
    } else {
      setSavedIds([...savedIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = typeof formData.skills === 'string' 
      ? formData.skills.split(',').map(s => s.trim()).filter(s => s) 
      : formData.skills;

    const newOpp = {
      ...formData,
      skills: skillsArray,
      id: isEditing ? formData.id : Date.now()
    };

    if (isEditing) {
      setOpportunities(opportunities.map(o => o.id === formData.id ? newOpp : o));
    } else {
      setOpportunities([newOpp, ...opportunities]);
    }
    
    setIsModalOpen(false);
    setIsEditing(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      ...item,
      skills: item.skills.join(', ')
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setOpportunities(opportunities.filter(o => o.id !== id));
    setSavedIds(savedIds.filter(savedId => savedId !== id));
  };

  const openModalForNew = () => {
    setFormData({
      id: 0,
      title: '',
      type: 'Course',
      platform: '',
      category: 'Web Development',
      skills: '',
      description: '',
      externalLink: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const filteredOpportunities = opportunities.filter(opp => {
    if (typeFilter !== 'All' && opp.type !== typeFilter) return false;
    if (categoryFilter !== 'All' && opp.category !== categoryFilter) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return opp.title.toLowerCase().includes(query) || 
             opp.platform.toLowerCase().includes(query) ||
             opp.description.toLowerCase().includes(query) ||
             opp.skills.some((s: string) => s.toLowerCase().includes(query));
    }
    return true;
  });

  const savedOpportunities = opportunities.filter(opp => savedIds.includes(opp.id));

  const renderCard = (opp: any) => (
    <Card key={opp.id} className="flex flex-col h-full hover:border-indigo-500/50 transition-colors group">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              opp.type === 'Course' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
              opp.type === 'Internship' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
              'bg-purple-500/10 text-purple-400 border border-purple-500/20'
            }`}>
              {opp.type}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              {opp.category}
            </span>
          </div>
          
          <div className="flex gap-2">
            {isStudent && (
              <button 
                onClick={() => handleSaveToggle(opp.id)}
                className="text-slate-400 hover:text-indigo-400 transition-colors"
                title={savedIds.includes(opp.id) ? "Remove from saved" : "Save opportunity"}
              >
                {savedIds.includes(opp.id) ? <BookmarkCheck className="w-5 h-5 text-indigo-400" /> : <Bookmark className="w-5 h-5" />}
              </button>
            )}
            {canEdit && (
              <>
                <button onClick={() => handleEdit(opp)} className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(opp.id)} className="text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white mb-1 line-clamp-2">{opp.title}</h3>
        <p className="text-sm text-indigo-400 font-medium mb-3">{opp.platform}</p>
        
        <p className="text-sm text-slate-400 mb-4 line-clamp-3 flex-1">{opp.description}</p>
        
        <div className="flex flex-wrap gap-1.5 mb-6">
          {opp.skills.slice(0, 4).map((skill: string, i: number) => (
            <span key={i} className="px-2 py-1 bg-[#0b1220] border border-slate-800 rounded text-xs text-slate-300">
              {skill}
            </span>
          ))}
          {opp.skills.length > 4 && (
            <span className="px-2 py-1 bg-[#0b1220] border border-slate-800 rounded text-xs text-slate-500">
              +{opp.skills.length - 4}
            </span>
          )}
        </div>

        <a 
          href={opp.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {opp.type === 'Internship' ? 'Apply Now' : 'View Course'}
          <ExternalLink className="w-4 h-4" />
        </a>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">Career Hub</h1>
          <p className="text-slate-400">Discover professional opportunities, courses, and certifications.</p>
        </div>
        {canEdit && (
          <button 
            onClick={openModalForNew}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Opportunity
          </button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-[#0b1220] border border-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
                >
                  <option value="All">All Types</option>
                  <option value="Course">Courses</option>
                  <option value="Internship">Internships</option>
                  <option value="Certification">Certifications</option>
                </select>
              </div>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#0b1220] border border-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
              >
                <option value="All">All Categories</option>
                <option value="AI">AI</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Cloud">Cloud</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Mobile Development">Mobile Development</option>
              </select>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search opportunities..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700 rounded-md pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Saved Opportunities Section (Student Only) */}
      {isStudent && savedOpportunities.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-indigo-400" />
            Saved Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedOpportunities.map(renderCard)}
          </div>
          <div className="h-px bg-slate-800 my-8"></div>
        </div>
      )}

      {/* All Opportunities Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-indigo-400" />
          {isStudent && savedOpportunities.length > 0 ? 'More Opportunities' : 'All Opportunities'}
        </h2>
        
        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map(renderCard)}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-800 border-dashed">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No opportunities found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0f172a] border border-slate-700 rounded-xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-[#0f172a] rounded-t-xl z-10">
              <h2 className="text-xl font-semibold text-white">{isEditing ? 'Edit Opportunity' : 'Add Opportunity'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Machine Learning Specialization" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                  <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500">
                    <option value="Course">Course</option>
                    <option value="Internship">Internship</option>
                    <option value="Certification">Certification</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500">
                    <option value="AI">AI</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cloud">Cloud</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Mobile Development">Mobile Development</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Platform</label>
                  <input type="text" required value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Coursera, LinkedIn" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">External Link</label>
                  <input type="url" required value={formData.externalLink} onChange={e => setFormData({...formData, externalLink: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="https://..." />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Skills (comma separated)</label>
                  <input type="text" required value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Python, React, AWS" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500 min-h-[100px]" placeholder="Brief description of the opportunity..." />
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 sticky bottom-0 bg-[#0f172a] rounded-b-xl">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">{isEditing ? 'Save Changes' : 'Add Opportunity'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
