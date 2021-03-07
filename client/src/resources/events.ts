import { Resource } from "../hooks/useRequest";

export const events: Resource = {
  get: (id: number) => {
    return {
      path: `events/${id}`,
      method: "GET",
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
