import { createFileRoute } from '@tanstack/react-router';
import {
  createCollection,
  localStorageCollectionOptions,
  useLiveQuery,
} from '@tanstack/react-db';
import z from 'zod';
import { AddEvent } from '../components/AddEvent';
import { EventList } from '../components/EventList';

const eventsSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const eventsCollection = createCollection(
  localStorageCollectionOptions({
    id: 'events',
    getKey: (event) => event.id,
    schema: eventsSchema,
    storageKey: 'app-events',
  })
);

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <h1 className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
        Event Planner
      </h1>
      <Events />
    </div>
  );
}

function Events() {
  const { data: events } = useLiveQuery((q) =>
    q
      .from({ event: eventsCollection })
      .orderBy(({ event }) => event.createdAt, 'asc')
  );

  const addEvent = (eventName: string) => {
    eventsCollection.insert({
      id: crypto.randomUUID(),
      name: eventName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const deleteEvent = (id: string) => eventsCollection.delete(id);

  return (
    <div className="mt-6 w-full max-w-md rounded-xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur-lg">
      <AddEvent onAdd={addEvent} />
      <EventList events={events} onDelete={deleteEvent} />
    </div>
  );
}
