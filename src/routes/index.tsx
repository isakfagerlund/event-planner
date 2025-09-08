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
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-4">
      <h1 className="mt-8 text-4xl font-bold text-gray-800">Event Planner</h1>
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
    <div className="mt-6 w-full max-w-md rounded-xl bg-white p-6 shadow">
      <AddEvent onAdd={addEvent} />
      <EventList events={events} onDelete={deleteEvent} />
    </div>
  );
}
