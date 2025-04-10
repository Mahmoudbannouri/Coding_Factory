import { User } from './User';
import { CourseResource } from './CourseResource';
import { CategoryEnum } from './CategoryEnum';

export class Course {
  id!: number;
  title!: string;
  description!: string;
  level!: string;
  image!: string;
  categoryCourse!: CategoryEnum;
  trainer?: User;
  resources?: CourseResource[];
  students?: User[];
}
