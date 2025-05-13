import { User } from './User';
import { CourseResource } from './CourseResource';
import { CategoryEnum } from './CategoryEnum';

export class Course {
  id!: number;
  title!: string;
  description!: string;
  level!: string;
  rate!: number;
  image!: string;
  categoryCourse!: CategoryEnum | string; // Allow both enum and string
  trainerId!: number;
  resources!: CourseResource[];
  qrCodeUrl!: string;
  hasReviewed?: boolean; // Made optional
  studentIds?: number[];
}

