import { EventItem } from './EventItem';

interface Event {
  id: string;
  name: string;
}

interface EventListProps {
  events: Event[];
  onDelete: (id: string) => void;
}

export function EventList({ events, onDelete }: EventListProps) {
  if (events.length === 0) {
    return <p className="text-center text-gray-500">No events yet</p>;
  }

  return (
    <ul className="space-y-2">
      {events.map((event) => (
        <EventItem key={event.id} event={event} onDelete={onDelete} />
      ))}
    </ul>
  );
}

