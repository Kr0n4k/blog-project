export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserData {
  findUserByID: User;
}