import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { LineChart } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic mock login validation
    if (email === 'admin@successintel.com' && password === 'admin123') {
      login({ name: 'System Admin', email, role: 'admin' });
      navigate('/admin/dashboard');
    } else if (email.includes('student')) {
      login({ name: 'Demo Student', email, role: 'student' });
      navigate('/student/dashboard');
    } else if (email.includes('teacher')) {
      login({ name: 'Demo Teacher', email, role: 'teacher' });
      navigate('/teacher/dashboard');
    } else if (email.includes('parent')) {
      login({ name: 'Demo Parent', email, role: 'parent' });
      navigate('/parent/dashboard');
    } else {
      alert('Invalid credentials. Try demo buttons.');
    }
  };

  const demoLogin = (role: 'student' | 'teacher' | 'parent' | 'admin') => {
    let user;
    if (role === 'admin') {
      user = { name: 'System Admin', email: 'admin@successintel.com', role };
    } else {
      user = { name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`, email: `${role}@demo.com`, role };
    }
    login(user);
    navigate(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#0b1220] flex flex-col items-center justify-center p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
          <LineChart className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-semibold text-white tracking-tight">Success Intel</span>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0b1220] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1b2433] text-slate-400">Quick Demo Login</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={() => demoLogin('student')} className="py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-sm transition-colors">
                Student
              </button>
              <button onClick={() => demoLogin('teacher')} className="py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-sm transition-colors">
                Teacher
              </button>
              <button onClick={() => demoLogin('parent')} className="py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-sm transition-colors">
                Parent
              </button>
              <button onClick={() => demoLogin('admin')} className="py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-sm transition-colors">
                Admin
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account? <Link to="/signup" className="text-indigo-400 hover:underline">Sign up</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
