import { useMemo, useState } from 'react';
import { CalendarPlus, Trash2 } from 'lucide-react';

export default function CalendarTab({ user }) {
  const [events, setEvents] = useState(() => {
    const raw = localStorage.getItem('ical_events');
    return raw ? JSON.parse(raw).filter((e) => e.userId === user.id) : [];
  });

  const save = (next) => {
    setEvents(next);
    const all = JSON.parse(localStorage.getItem('ical_events') || '[]').filter((e) => e.userId !== user.id);
    const merged = [...all, ...next];
    localStorage.setItem('ical_events', JSON.stringify(merged));
  };

  const addEvent = () => {
    const title = prompt('Event title');
    if (!title) return;
    const date = prompt('Date (YYYY-MM-DD)');
    const start = prompt('Start (HH:MM, 24h)');
    const end = prompt('End (HH:MM, 24h)');
    if (!date || !start || !end) return;
    const startIso = new Date(`${date}T${start}:00`).toISOString();
    const endIso = new Date(`${date}T${end}:00`).toISOString();
    const next = [...events, { id: crypto.randomUUID(), userId: user.id, title, start: startIso, end: endIso }];
    save(next);
  };

  const remove = (id) => {
    save(events.filter((e) => e.id !== id));
  };

  const grouped = useMemo(() => {
    const map = {};
    for (const e of events) {
      const key = new Date(e.start).toDateString();
      map[key] = map[key] || [];
      map[key].push(e);
    }
    Object.values(map).forEach((list) => list.sort((a, b) => new Date(a.start) - new Date(b.start)));
    return map;
  }, [events]);

  const keys = Object.keys(grouped);

  return (
    <div className="space-y-6">
      <section className="bg-white border rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Calendar</h2>
          <button onClick={addEvent} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-3 py-1.5">
            <CalendarPlus className="h-4 w-4" /> Add event
          </button>
        </div>
      </section>

      {!keys.length && <p className="text-slate-500">No events yet.</p>}
      {keys.map((k) => (
        <section key={k} className="bg-white border rounded-2xl p-6">
          <h3 className="font-medium mb-3">{k}</h3>
          <ul className="space-y-2">
            {grouped[k].map((e) => (
              <li key={e.id} className="border rounded-lg px-3 py-2 flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.title}</div>
                  <div className="text-sm text-slate-500">
                    {new Date(e.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                    {new Date(e.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <button className="text-red-600" onClick={() => remove(e.id)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
