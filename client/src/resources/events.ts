import { Resource } from "../hooks/useRequest";
import { Event } from "./dashboard";

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

const demoEvents: Event[] = [
  {
    status: "incomplete",
    replies: 5,
    creator: "Author Name",
    date_time: "2021-03-08T04:01:28.910Z",
    description: "Event description...",
    location: "Here",
    title: "Event Title",
    invitees: 20,
  },
  {
    status: "complete",
    score: 3.3,
    creator: "Author Name",
    date_time: "2021-03-08T04:01:28.910Z",
    description: "Event description...",
    location: "There",
    title: "Created Event",
    invitees: 10,
  },
  {
    status: "complete",
    score: 1.2,
    creator: "Author Name",
    date_time: "2021-03-08T04:01:28.910Z",
    description: "Event description...",
    location: "There",
    title: "Event Title",
    invitees: 10,
  },
  {
    status: "complete",
    score: 4.5,
    creator: "Author Name",
    date_time: "2021-03-08T04:01:28.910Z",
    description: "Event description...",
    location: "There",
    title: "Event Title",
    invitees: 10,
  },
  {
    status: "complete",
    score: 4.3,
    creator: "Nathan Gentry",
    date_time: "2021-03-08T04:01:28.910Z",
    description:
      "Get ready to celebrate with Alicia to help her kick off her 25th year! Just because we are masking up doesn’t mean we have to shut down the party 🎉\n\nRemember to bring your dancing shoes cause we’re gonna be dancing the night away 💃",
    location: "123 Main St.",
    title: "Alicia's Birthday Bash",
    invitees: 12,
  },
  {
    status: "complete",
    score: 2.7,
    creator: "Author Name",
    date_time: "2021-03-08T04:01:28.910Z",
    description: "Event description...",
    location: "There",
    title: "Event Title",
    invitees: 10,
  },
  {
    status: "complete",
    score: 5.0,
    creator: "Daniel Noon",
    date_time: "2021-03-08T04:01:28.910Z",
    description: "Event description...",
    location: "There",
    title: "Event Title",
    invitees: 10,
  },
  {
    status: "complete",
    score: 1.2,
    creator: "Daniel Noon",
    date_time: "2021-03-08T04:01:28.910Z",
    description: "Event description...",
    location: "There",
    title: "Event Title",
    invitees: 10,
  },
  {
    status: "complete",
    score: 1.2,
    creator: "Daniel Noon",
    date_time: "2021-03-08T04:01:28.910Z",
    description: "Heck yeah it's maskless time",
    location: "There",
    title: "Uncomfortable Event",
    invitees: 10,
  },
];
