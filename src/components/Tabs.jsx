import { useState } from 'react';
import { Home, BookOpen, CalendarDays, Clock, LogOut } from 'lucide-react';
import HomeTab from './tabs/HomeTab.jsx';
import SyllabusTab from './tabs/SyllabusTab.jsx';
import TimetableTab from './tabs/TimetableTab.jsx';
import CalendarTab from './tabs/CalendarTab.jsx';

const tabs = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'syllabus', label: 'Syllabus', icon: BookOpen },
  { key: 'timetable', label: 'Timetable', icon: Clock },
  { key: 'calendar', label: 'Calendar', icon: CalendarDays },
];

export default function Tabs({ user, onSignOut }) {
  const [active, setActive] = useState('home');

  return (
    <div className="max-w-5xl mx-auto">
      <header className="flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-3">
          <img src={user?.avatar} alt="avatar" className="h-10 w-10 rounded-xl" />
          <div>
            <div className="text-sm text-slate-500">Welcome back</div>
            <div className="font-semibold">{user?.fullName || 'Student'}</div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-slate-50"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </header>

      <main className="px-4 pb-24">
        {active === 'home' && <HomeTab user={user} goCalendar={() => setActive('calendar')} />}
        {active === 'syllabus' && <SyllabusTab user={user} />}
        {active === 'timetable' && <TimetableTab user={user} />}
        {active === 'calendar' && <CalendarTab user={user} />}
      </main>

      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur border rounded-2xl shadow-lg px-3 py-2">
        <ul className="flex items-center gap-1">
          {tabs.map(({ key, label, icon: Icon }) => (
            <li key={key}>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-colors ${
                  active === key ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100'
                }`}
                onClick={() => setActive(key)}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
