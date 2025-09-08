export type QueuedEvent = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "event-queue";

const readQueue = (): QueuedEvent[] => {
  if (typeof localStorage === "undefined") {
    return [];
  }
  try {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]",
    ) as QueuedEvent[];
  } catch {
    return [];
  }
};

const writeQueue = (queue: QueuedEvent[]) => {
  if (typeof localStorage === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
};

export const enqueue = (event: QueuedEvent) => {
  const queue = readQueue();
  queue.push(event);
  writeQueue(queue);
};

export const initQueue = (
  process: (event: QueuedEvent) => Promise<void> | void,
) => {
  const flush = async () => {
    const queue = readQueue();
    if (!queue.length) return;
    const remaining: QueuedEvent[] = [];
    for (const item of queue) {
      try {
        await process(item);
      } catch {
        remaining.push(item);
      }
    }
    writeQueue(remaining);
  };

  if (typeof window !== "undefined") {
    window.addEventListener("online", flush);
    const online = typeof navigator === "undefined" ? true : navigator.onLine;
    if (online) {
      flush();
    }
  }
};
