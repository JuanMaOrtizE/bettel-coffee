export type Role =
  | "OWNER"
  | "ADMIN"
  | "WAITER"
  | "BARISTA"
  | "PARTNER";

export type AuthenticatedUser = {
  id: string;
  businessId: string;
  businessName: string;
  businessSlug: string;
  fullName: string;
  username: string;
  role: Role;
};

export type AuthResponse = {
  user: AuthenticatedUser;
};
