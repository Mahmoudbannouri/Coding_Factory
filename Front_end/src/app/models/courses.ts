import { User } from './User';
import { CourseResource } from './CourseResource';
import { CategoryEnum } from './CategoryEnum';

// course.model.ts
export class Course {
  id!: number;
  title!: string;
  description!: string;
  level!: string;
  image!: string;
  categoryCourse!: CategoryEnum;
  trainerId?: number;  // Changed from User to just ID
  resources?: CourseResource[];
  studentIds?: number[];  // Changed from User[] to number[]
  rate?: number;
  hasReviewed: boolean;
}