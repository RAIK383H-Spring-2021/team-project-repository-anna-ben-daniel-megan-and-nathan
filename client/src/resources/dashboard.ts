import { FetchRequest } from "../hooks/useRequest";
import { Event } from "../models/Event";
import { events } from "./examples";

export interface UserInvitationsResponse {
  newEvents: Event[];
  otherEvents: Event[];
}

export interface UserCreatedEventsResponse {
  events: Event[];
}

const exampleInvitationEvents: UserInvitationsResponse = {
  newEvents: [events[1], events[2], events[3]],
  otherEvents: [events[6], events[4], events[5], events[7]],
};

export function getUserInvitations(userId: string): FetchRequest {
  return {
    method: "GET",
    path: `/users/${userId}/invitations`,
    debug: () => exampleInvitationEvents,
  };
}

const exampleCreatedEvents: UserCreatedEventsResponse = {
  events: [events[0], events[8], events[9], events[10]],
};

export function getUserCreatedEvents(userId: string): FetchRequest {
  return {
    method: "GET",
    path: `/users/${userId}/events`,
    debug: () => exampleCreatedEvents,
  };
}
