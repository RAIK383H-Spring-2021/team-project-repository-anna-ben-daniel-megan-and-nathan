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
      const idx = registry.get(name)?.indexOf(callback);
      if (idx) {
        registry.get(name)?.splice(idx, 1);
      }
    };
  });
}

export function publish<T>(event: string, data?: T) {
  if (registry.has(event)) {
    registry.get(event)?.forEach((cb) => cb(data));
  }
}
