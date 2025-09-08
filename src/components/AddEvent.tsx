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
    <form
      onSubmit={handleSubmit}
      className="mb-4 flex flex-col gap-2 sm:flex-row"
    >
      <input
        name="eventName"
        placeholder="New event"
        className="flex-1 rounded border border-gray-300/50 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-sm focus:border-indigo-500 focus:outline-none"
      />
      <button
        type="submit"
        className="w-full rounded bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-white shadow hover:from-indigo-600 hover:to-purple-600 sm:w-auto"
      >
        Add
      </button>
    </form>
  );
}

