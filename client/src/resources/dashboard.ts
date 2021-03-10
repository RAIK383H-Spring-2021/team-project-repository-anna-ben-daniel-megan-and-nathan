import { FetchRequest } from "../hooks/useRequest";

interface EventBase {
  id: number;
  creator: string;
  date_time: string;
  location: string;
  description: string;
  title: string;
  invitees: number;
}

interface IncompleteEvent extends EventBase {
  status: "incomplete";
  replies: number;
}

interface CompleteEvent extends EventBase {
  status: "complete";
  score: number;
}

export type Event = IncompleteEvent | CompleteEvent;

export interface UserInvitationsResponse {
  newEvents: Event[];
  updatedEvents: Event[];
  otherEvents: Event[];
}

export interface UserCreatedEventsResponse {
  events: Event[];
}

const exampleInvitationEvents: UserInvitationsResponse = {
  newEvents: [
    {
      status: "incomplete",
      replies: 8,
      creator: "Daniel Noon",
      date_time: "2021-03-08T04:01:28.910Z",
      description: "A test event",
      location: "Here",
      title: "Incomplete Event",
      invitees: 24,
      id: 0,
    },
    {
      status: "incomplete",
      replies: 12,
      creator: "Author Name",
      date_time: "2021-03-08T04:01:28.910Z",
      description: "Event description...",
      location: "Here",
      title: "Event Title",
      invitees: 20,
      id: 1,
    },
  ],
  updatedEvents: [
    {
      status: "complete",
      score: 1.2,
      creator: "Daniel Noon",
      date_time: "2021-03-08T04:01:28.910Z",
      description: "Heck yeah it's maskless time",
      location: "There",
      title: "Uncomfortable Event",
      invitees: 10,
      id: 10,
    },
  ],
  otherEvents: [
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
      id: 6,
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
      id: 7,
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
      id: 8,
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
      id: 9,
    },
  ],
};

export function getUserInvitations(userId: string): FetchRequest {
  return {
    method: "GET",
    path: `/users/${userId}/invitations`,
    debug: () => exampleInvitationEvents,
  };
}

const exampleCreatedEvents: UserCreatedEventsResponse = {
  events: [
    {
      status: "incomplete",
      replies: 5,
      creator: "Author Name",
      date_time: "2021-03-08T04:01:28.910Z",
      description: "Event description...",
      location: "Here",
      title: "Event Title",
      invitees: 20,
      id: 2,
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
      id: 3,
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
      id: 4,
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
      id: 5,
    },
  ],
};

export function getUserCreatedEvents(userId: string): FetchRequest {
  return {
    method: "GET",
    path: `/users/${userId}/events`,
    debug: () => exampleCreatedEvents,
  };
}
