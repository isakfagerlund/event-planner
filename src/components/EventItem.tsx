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
    <li className="group flex items-center justify-between rounded-lg bg-white/70 px-4 py-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-white/90">
      <span>{event.name}</span>
      <button
        onClick={() => onDelete(event.id)}
        className="opacity-0 transition-opacity group-hover:opacity-100 text-red-500 hover:text-red-700"
        aria-label="Delete event"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.166L19.5 19.5a2.25 2.25 0 01-2.244 2.25h-10.5A2.25 2.25 0 014.5 19.5L5.772 5.79m13.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0L6.5 4.5m0 0A2.25 2.25 0 018.737 3h6.513A2.25 2.25 0 0117.487 4.5m-10.987 0h10.987"
          />
        </svg>
      </button>
    </li>
  );
}

