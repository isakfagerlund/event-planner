import { createFileRoute } from "@tanstack/react-router";
import {
  createCollection,
  localStorageCollectionOptions,
  useLiveQuery,
} from "@tanstack/react-db";
import { useCallback, useEffect, useState } from "react";
import z from "zod";
import { enqueue, initQueue, type QueuedEvent } from "../offlineQueue";

const eventsSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const eventsCollection = createCollection(
  localStorageCollectionOptions({
    id: "events",
    getKey: (event) => event.id,
    schema: eventsSchema,
    storageKey: "app-events",
  }),
);

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <Header onNew={() => setShowForm(true)} />
      <main className="mx-auto max-w-2xl space-y-6 p-4">
        {showForm && <AddEvent onClose={() => setShowForm(false)} />}
        <Events />
      </main>
    </>
  );
}

function Header({ onNew }: { onNew: () => void }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between p-4">
        <h1 className="text-2xl font-semibold">Event Planner</h1>
        <button
          onClick={onNew}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          New Task
        </button>
      </div>
    </header>
  );
}

function Events() {
  const { data: events = [] } = useLiveQuery((q) =>
    q
      .from({ event: eventsCollection })
      .orderBy(({ event }) => event.createdAt, "asc"),
  );

  const deleteEvent = (id: string) => eventsCollection.delete(id);

  if (events.length === 0) {
    return <p className="text-center text-gray-500">No tasks yet</p>;
  }

  return (
    <ul className="space-y-4">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="text-lg font-medium">{event.name}</span>
          <button
            onClick={() => deleteEvent(event.id)}
            className="text-sm text-red-600 hover:text-red-700 focus:outline-none"
            aria-label="Delete"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

function AddEvent({ onClose }: { onClose: () => void }) {
  const processEvent = useCallback(async (event: QueuedEvent) => {
    eventsCollection.insert({
      ...event,
      createdAt: new Date(event.createdAt),
      updatedAt: new Date(event.updatedAt),
    });
  }, []);

  useEffect(() => {
    initQueue(processEvent);
  }, [processEvent]);

  const addEvent = async (eventName: string) => {
    const newEvent: QueuedEvent = {
      id: crypto.randomUUID(),
      name: eventName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const online = typeof navigator === "undefined" ? true : navigator.onLine;
    if (!online) {
      enqueue(newEvent);
      return;
    }

    try {
      await processEvent(newEvent);
    } catch {
      enqueue(newEvent);
    }
  };

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const eventName = formData.get("eventName") as string;
        if (eventName) {
          await addEvent(eventName);
          event.currentTarget.reset();
          onClose();
        }
      }}
      className="space-y-4 rounded-lg bg-white p-4 shadow-sm"
    >
      <div>
        <label
          htmlFor="eventName"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Task Name
        </label>
        <input
          id="eventName"
          name="eventName"
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
