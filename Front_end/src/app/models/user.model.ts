export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  roles: string[];
  enabled: boolean;
  verified: boolean;
  lastActivity?: Date;
}