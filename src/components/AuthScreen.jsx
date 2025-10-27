import { useMemo, useState } from 'react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import AvatarGrid from './AvatarGrid.jsx';

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState('signup'); // 'signup' | 'signin'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (val) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(val);
  const canSubmit = useMemo(() => {
    if (mode === 'signup') {
      return fullName.trim().length > 1 && isValidEmail(email) && password.length >= 6 && avatar;
    }
    return isValidEmail(email) && password.length >= 6;
  }, [mode, fullName, email, password, avatar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // For this iteration, simulate persistence using localStorage
    if (mode === 'signup') {
      const usersRaw = localStorage.getItem('ical_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        setError('An account with this email already exists.');
        return;
      }
      const newUser = { id: crypto.randomUUID(), fullName, email, password, avatar };
      users.push(newUser);
      localStorage.setItem('ical_users', JSON.stringify(users));
      localStorage.setItem('ical_current_user', JSON.stringify(newUser));
      onAuthenticated(newUser);
      return;
    }

    if (mode === 'signin') {
      const usersRaw = localStorage.getItem('ical_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const found = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (!found) {
        setError('Invalid email or password.');
        return;
      }
      localStorage.setItem('ical_current_user', JSON.stringify(found));
      onAuthenticated(found);
    }
  };

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white/70 backdrop-blur rounded-2xl shadow-xl overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="p-8 bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-white/20 grid place-items-center">
                <User className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-semibold">iCalendar</h1>
            </div>
            <p className="text-white/90 leading-relaxed">
              Smart study scheduling. Create your syllabus, set your weekly timetable, and let the
              app plan your day.
            </p>
            <div className="mt-10 hidden md:block">
              <img
                src="https://illustrations.popsy.co/blue/reading.svg"
                alt="Study"
                className="w-full max-w-xs"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 rounded-lg px-4 py-2 font-medium border ${
                  mode === 'signup' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 rounded-lg px-4 py-2 font-medium border ${
                  mode === 'signin' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white'
                }`}
              >
                Sign In
              </button>
            </div>

            {mode === 'signup' && (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-slate-700">Full Name</span>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                      placeholder="Jane Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  </div>
                </label>
              </div>
            )}

            <div className="space-y-4 mt-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <div className="mt-1 relative">
                  <input
                    type="email"
                    className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                    placeholder="jane@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">Password</span>
                <div className="mt-1 relative">
                  <input
                    type="password"
                    className="w-full rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 pl-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 mt-1">Minimum 6 characters.</p>
              </label>

              {mode === 'signup' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Choose an avatar</span>
                    {avatar && (
                      <img src={avatar} alt="selected avatar" className="h-8 w-8 rounded-lg" />
                    )}
                  </div>
                  <AvatarGrid value={avatar} onChange={setAvatar} />
                </div>
              )}

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2.5 disabled:opacity-50"
              >
                {mode === 'signup' ? 'Create account' : 'Sign in'}
                <ArrowRight className="h-5 w-5" />
              </button>

              {mode === 'signin' && (
                <p className="text-xs text-slate-500 text-center mt-2">
                  New here?{' '}
                  <button type="button" className="text-indigo-600" onClick={() => setMode('signup')}>
                    Create an account
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
