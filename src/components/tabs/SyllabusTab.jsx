import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function SyllabusTab({ user }) {
  const storageKey = `ical_syllabus_${user.id}`;
  const [subjects, setSubjects] = useState(() => {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  });
  const [subjectName, setSubjectName] = useState('');

  const save = (next) => {
    setSubjects(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const addSubject = () => {
    if (!subjectName.trim()) return;
    const next = [
      ...subjects,
      { id: crypto.randomUUID(), name: subjectName.trim(), units: [] },
    ];
    save(next);
    setSubjectName('');
  };

  const addUnit = (sid) => {
    const unitName = prompt('Unit name');
    if (!unitName) return;
    const next = subjects.map((s) =>
      s.id === sid ? { ...s, units: [...s.units, { id: crypto.randomUUID(), name: unitName, chapters: [] }] } : s
    );
    save(next);
  };

  const addChapter = (sid, uid) => {
    const name = prompt('Chapter name');
    if (!name) return;
    const hoursStr = prompt('Estimated hours (e.g., 2.5)');
    const hours = parseFloat(hoursStr || '0');
    if (!hours || hours <= 0) return;
    const next = subjects.map((s) => {
      if (s.id !== sid) return s;
      return {
        ...s,
        units: s.units.map((u) =>
          u.id === uid
            ? {
                ...u,
                chapters: [...u.chapters, { id: crypto.randomUUID(), name, hours }],
              }
            : u
        ),
      };
    });
    save(next);
  };

  const removeSubject = (sid) => {
    save(subjects.filter((s) => s.id !== sid));
  };

  const subjectList = useMemo(() => subjects, [subjects]);

  return (
    <div className="space-y-6">
      <section className="bg-white border rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-4">Create Subjects</h2>
        <div className="flex gap-2">
          <input
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="e.g., Biology"
            className="flex-1 rounded-lg border-slate-300 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button onClick={addSubject} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </section>

      <section className="bg-white border rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-4">Your Syllabus</h2>
        {!subjectList.length && <p className="text-slate-500">No subjects yet. Add your first one above.</p>}
        <ul className="space-y-4">
          {subjectList.map((s) => (
            <li key={s.id} className="border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{s.name}</h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => addUnit(s.id)} className="text-indigo-600">Add unit</button>
                  <button onClick={() => removeSubject(s.id)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <ul className="mt-3 space-y-3">
                {s.units.map((u) => (
                  <li key={u.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{u.name}</div>
                      <button onClick={() => addChapter(s.id, u.id)} className="text-indigo-600">Add chapter</button>
                    </div>
                    <ul className="mt-2 space-y-2">
                      {u.chapters.map((c) => (
                        <li key={c.id} className="text-sm text-slate-700 flex items-center justify-between">
                          <span>{c.name}</span>
                          <span className="text-slate-500">{c.hours}h</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
