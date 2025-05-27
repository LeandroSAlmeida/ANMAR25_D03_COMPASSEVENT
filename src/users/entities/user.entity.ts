export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImageUrl: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
