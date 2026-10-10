import type { Role } from '../generated/prisma/client.js';

export type AuthenticatedUser = {
  id: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  fullName: string;
  username: string;
  role: Role;
};
