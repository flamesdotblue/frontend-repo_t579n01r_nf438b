import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

export default function HomeTab({ user, goCalendar }) {
  const today = new Date();
  const tomorrow = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d;
  }, [today]);

  const allEvents = JSON.parse(localStorage.getItem('ical_events') || '[]').filter(
    (e) => e.userId === user.id
  );

  const eventsForDay = (d) => {
    const start = new Date(d);
    start.setHours(0, 0, 0, 0);
    const end = new Date(d);
    end.setHours(23, 59, 59, 999);
    return allEvents
      .filter((e) => {
        const s = new Date(e.start);
        return s >= start && s <= end;
      })
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  };

  const todays = eventsForDay(today);
  const tomorrows = eventsForDay(tomorrow);

  const generateSchedule = () => {
    // Minimal mock: Create a sample event for demonstration
    const newEvent = {
      id: crypto.randomUUID(),
      userId: user.id,
      title: 'Sample Study Session',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem('ical_events') || '[]');
    existing.push(newEvent);
    localStorage.setItem('ical_events', JSON.stringify(existing));
    goCalendar?.();
  };

  return (
    <div className="space-y-8">
      <section className="bg-white border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Today</h2>
          <button
            onClick={generateSchedule}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2"
          >
            <Sparkles className="h-4 w-4" /> Generate Study Schedule
          </button>
        </div>
        <EventList items={todays} emptyText="No events scheduled for today." />
      </section>

      <section className="bg-white border rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-4">Tomorrow</h2>
        <EventList items={tomorrows} emptyText="No events scheduled for tomorrow." />
      </section>
    </div>
  );
}

function EventList({ items, emptyText }) {
  if (!items.length) {
    return <p className="text-slate-500">{emptyText}</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map((e) => (
        <li key={e.id} className="border rounded-xl px-4 py-3">
          <div className="font-medium">{e.title}</div>
          <div className="text-sm text-slate-500">
            {new Date(e.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
            {new Date(e.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </li>
      ))}
    </ul>
  );
}
