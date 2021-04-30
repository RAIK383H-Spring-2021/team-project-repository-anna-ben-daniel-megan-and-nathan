import { useEffect } from "react";

type subscription<T> = (data: T) => void;

const registry = new Map<string, subscription<any>[]>();

export function useSubscription<T>(name: string, callback: subscription<T>) {
  useEffect(() => {
    if (!registry.has(name)) {
      registry.set(name, []);
    }

    registry.get(name)?.push(callback);

    return () => {
      const list = registry.get(name);

      const idx = list?.indexOf(callback);
      if (idx && idx >= 0) {
        list?.splice(idx, 1);
      }
    };
  });
}

export function publish<T>(event: string, data?: T) {
  const eventList = registry.get(event);

  if (eventList) {
    eventList.forEach((cb) => cb(data));
  }
}
