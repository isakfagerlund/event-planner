import { createFileRoute } from '@tanstack/react-router';
import '../App.css';
import {
  createCollection,
  localStorageCollectionOptions,
  useLiveQuery,
} from '@tanstack/react-db';
import z from 'zod';

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
    <div className="App">
      <h1>Event Planner</h1>
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

  const deleteEvent = (id: string) => eventsCollection.delete(id);

  return (
    <div>
      <p>Events</p>
      <AddEvent />
      <ul>
        {events.map((event) => (
          <li>
            {event.name} <span onClick={() => deleteEvent(event.id)}>🛑</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddEvent() {
  const addEvent = (eventName: string) => {
    eventsCollection.insert({
      id: crypto.randomUUID(),
      name: eventName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const eventName = formData.get('eventName') as string;
          if (eventName) {
            addEvent(eventName);
            event.currentTarget.reset();
          }
        }}
      >
        <input name="eventName" className="border border-black"></input>
        <button className="border px-2 border-black" type="submit">
          Add event
        </button>
      </form>
    </div>
  );
}
