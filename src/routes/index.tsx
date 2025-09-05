import { createFileRoute } from '@tanstack/react-router';
import '../App.css';

export const Route = createFileRoute('/')({
  component: App,
});

function App() {
  return (
    <div className="App">
      <h1>Event Planner</h1>
    </div>
  );
}
