import { CategoryEnum } from './CategoryEnum';
import { Centre } from './Centre';
import { User } from './User';

export class Event {
  idEvent: number;
  eventName: string;
  eventDescription: string;
  eventDate: string; // Use string because Angular handles date conversion
  eventCategory: CategoryEnum;
  imageUrl:  string;
  centre: Centre;
  participants: User[];
  eventCreator: User;
  eventDateOnly?: string;
  eventTimeOnly?: string;
}
