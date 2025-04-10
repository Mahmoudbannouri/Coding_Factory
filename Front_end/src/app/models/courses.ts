import { User } from './User';
import { CourseResource } from './CourseResource';

export class Course {
  id!: number;
  title!: string;
  description!: string;
  rate!: number;
  startDate!: Date;
  endDate!: Date;
  categoryCourse!: string;
  trainer!: User; // `trainer` is now a `User` object
  resources!: CourseResource[];
  students!: Set<User>;
  image!: string; // Add the image field here
  isExpanded!: boolean; // Add this property

}
