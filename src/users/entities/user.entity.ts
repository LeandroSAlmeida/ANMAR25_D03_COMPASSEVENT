import { UserRole } from '../enums/userRole.enum';
import { UserStatus } from '../enums/userStatus.enum';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImageUrl: string;
  createdAt: string;
  isActive: UserStatus;
  role: UserRole;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
