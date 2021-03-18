import { Resource } from "../hooks/useRequest";
import { events as demoEvents } from "./examples";

export const events: Resource = {
  get: (id: number) => {
    return {
      path: `events/${id}`,
      method: "GET",
      debug: () => demoEvents[id],
    };
  },

  post: (body: {
    name: string;
    description: string;
    date: string;
    time: string;
    address: string;
    location: string;
    mask: boolean;
    distancing: number;
    food: boolean;
  }) => {
    return {
      path: "events",
      method: "POST",
      body,
    };
  },
};
