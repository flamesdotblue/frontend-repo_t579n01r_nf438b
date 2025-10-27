import { useMemo, useState } from 'react';
import { Plus, Copy } from 'lucide-react';

const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export default function TimetableTab({ user }) {
  const storageKey = `ical_timetable_${user.id}`;
  const [table, setTable] = useState(() => {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : days.reduce((acc, d) => ({ ...acc, [d]: [] }), {});
  });

  const subjects = useMemo(() => {
    const syllabusRaw = localStorage.getItem(`ical_syllabus_${user.id}`);
    const syllabus = syllabusRaw ? JSON.parse(syllabusRaw) : [];
    return syllabus.map((s) => s.name);
  }, [user.id]);

  const save = (next) => {
    setTable(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const addSlot = (day) => {
    if (!subjects.length) {
      alert('Please add subjects in the Syllabus tab first.');
      return;
    }
    const subject = prompt(`Subject (${subjects.join(', ')})`);
    if (!subject || !subjects.includes(subject)) return;
    const start = prompt('Start time (HH:MM, 24h)');
    const end = prompt('End time (HH:MM, 24h)');
    if (!start || !end) return;
    const next = { ...table, [day]: [...table[day], { id: crypto.randomUUID(), subject, start, end }] };
    save(next);
  };

  const copyWeekdays = () => {
    const mon = table['Monday'];
    const next = { ...table };
    ['Tuesday','Wednesday','Thursday','Friday'].forEach((d) => (next[d] = [...mon]));
    save(next);
  };

  const copyWeekend = () => {
    const sat = table['Saturday'];
    const next = { ...table, Sunday: [...sat] };
    save(next);
  };

  return (
    <div className="space-y-6">
      <section className="bg-white border rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Weekly Timetable</h2>
          <div className="flex items-center gap-2">
            <button onClick={copyWeekdays} className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5">
              <Copy className="h-4 w-4" /> Apply to weekdays
            </button>
            <button onClick={copyWeekend} className="inline-flex items-center gap-2 rounded-lg border px-3 py-1.5">
              <Copy className="h-4 w-4" /> Apply to weekend
            </button>
          </div>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        {days.map((d) => (
          <section key={d} className="bg-white border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">{d}</h3>
              <button onClick={() => addSlot(d)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-3 py-1.5">
                <Plus className="h-4 w-4" /> Add slot
              </button>
            </div>
            {!table[d].length && <p className="text-slate-500">No study slots added.</p>}
            <ul className="space-y-2">
              {table[d].map((s) => (
                <li key={s.id} className="border rounded-lg px-3 py-2 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">{s.start} - {s.end}</div>
                    <div className="font-medium">{s.subject}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
