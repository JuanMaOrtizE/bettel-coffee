export type Role =
  | "OWNER"
  | "ADMIN"
  | "WAITER"
  | "BARISTA"
  | "PARTNER";

export type AuthenticatedUser = {
  id: string;
  fullName: string;
  username: string;
  role: Role;
};

export type AuthResponse = {
  user: AuthenticatedUser;
};
