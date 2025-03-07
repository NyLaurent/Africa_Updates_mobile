export enum Role {
  USER = 'USER',
  PUBLISHER = 'PUBLISHER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  bio?: string;
  role: Role;
  hasPaid?: boolean;
  createdAt: string;
} 