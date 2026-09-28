import type { Role } from '../generated/prisma/client.js';

export type AuthenticatedUser = {
  id: string;
  fullName: string;
  username: string;
  role: Role;
};
