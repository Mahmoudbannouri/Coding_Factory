import {Role} from './Role';
import {Course} from './courses';

export class User {
  id!: number;
  name!: string;
  email!: string;
  passwordHash!: string;
  phoneNumber!: string;
  address!: string;
  dateOfBirth!: Date;
  role!: Role;
  courses!: Course[];
  isSelected?: boolean; // Add this property to handle selection in the modal
}
