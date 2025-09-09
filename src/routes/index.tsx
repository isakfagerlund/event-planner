import { createFileRoute } from "@tanstack/react-router";
import {
  createCollection,
  localStorageCollectionOptions,
  useLiveQuery,
} from "@tanstack/react-db";
import { useState } from "react";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-2xl items-center justify-between p-4">
        <h1 className="text-2xl font-semibold">Event Planner</h1>
        <Button onClick={onNew}>New Task</Button>
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
    return <p className="text-center text-muted-foreground">No tasks yet</p>;
  }

  return (
    <ul className="space-y-4">
      {events.map((event) => (
        <li
          key={event.id}
          className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <span className="text-lg font-medium">{event.name}</span>
          <Button
            onClick={() => deleteEvent(event.id)}
            className="bg-transparent px-2 text-sm text-destructive hover:bg-destructive/10"
            aria-label="Delete"
          >
            Delete
          </Button>
        </li>
      ))}
    </ul>
  );
}

function AddEvent({ onClose }: { onClose: () => void }) {
  const addEvent = (eventName: string) => {
    eventsCollection.insert({
      id: crypto.randomUUID(),
      name: eventName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const eventName = formData.get("eventName") as string;
        if (eventName) {
          addEvent(eventName);
          event.currentTarget.reset();
          onClose();
        }
      }}
      className="space-y-4 rounded-lg border bg-card p-4 shadow-sm"
    >
      <div>
        <label htmlFor="eventName" className="mb-2 block text-sm font-medium">
          Task Name
        </label>
        <Input id="eventName" name="eventName" required />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button
          type="button"
          onClick={onClose}
          className="bg-transparent text-foreground border border-input hover:bg-muted"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
