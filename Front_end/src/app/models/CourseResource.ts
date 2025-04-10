import {Course} from './courses';

export class CourseResource {
  id!: number;
  title: string;
  resourceType!: string;
  link_video!: string;
  link_doccument!: string;
  description!: string;
  uploadDate!: Date;
  course!: Course;

}
