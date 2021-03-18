export interface Event {
  id: number;
  title: string;
  host_id: number;
  host_email: string;
  host_first_name: string;
  host_last_name: string;
  description: string;
  date_time: string;
  food_prepackaged: boolean;
  food_buffet: boolean;
  location: string;
  indoor: boolean;
  outdoor: boolean;
  remote: boolean;
  score: number;
  invitees: number;
  responses: number;
}

export function host_name(event: Event) {
  return `${event.host_first_name} ${event.host_last_name}`;
}
