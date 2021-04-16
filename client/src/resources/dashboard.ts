import { FetchRequest } from "../hooks/useRequest";
import { Event } from "../models/Event";

export interface UserInvitationsResponse {
  new_events: Event[];
  other_events: Event[];
}

export interface UserCreatedEventsResponse {
  events: Event[];
}

export function getUserInvitations(userId: string): FetchRequest {
  return {
    method: "GET",
    path: `/users/${userId}/invitations`,
  };
}

export function getUserCreatedEvents(userId: string): FetchRequest {
  return {
    method: "GET",
    path: `/users/${userId}/events`,
  };
}
