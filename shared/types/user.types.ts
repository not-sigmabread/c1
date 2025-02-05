export enum UserRole {
  GUEST = 'guest',
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  OWNER = 'owner'
}

export interface User {
  id: string;
  username: string;
  password?: string; // Optional for guest users
  role: UserRole;
  description?: string;
  createdAt: Date;
  isGuest: boolean;
  permissions: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  description: string;
  role: UserRole;
  friends: string[];
  blockedUsers: string[];
}
