interface Event {
  id: string;
  name: string;
}

interface EventItemProps {
  event: Event;
  onDelete: (id: string) => void;
}

export function EventItem({ event, onDelete }: EventItemProps) {
  return (
    <li className="flex items-center justify-between rounded bg-gray-50 px-4 py-2 hover:bg-gray-100">
      <span>{event.name}</span>
      <button
        onClick={() => onDelete(event.id)}
        className="text-red-500 hover:text-red-700"
        aria-label="Delete event"
      >
        🗑️
      </button>
    </li>
  );
}

