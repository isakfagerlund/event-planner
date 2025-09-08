import { FormEvent } from 'react';

interface AddEventProps {
  onAdd: (name: string) => void;
}

export function AddEvent({ onAdd }: AddEventProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const eventName = formData.get('eventName') as string;
    if (eventName) {
      onAdd(eventName);
      event.currentTarget.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        name="eventName"
        placeholder="New event"
        className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
}

