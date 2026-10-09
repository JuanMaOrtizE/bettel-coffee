import {
  BookOpenText,
  Grid3X3,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "../features/auth/auth.types";

export type AppNavigationItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  allowedRoles: readonly Role[];
};

const defaultRouteByRole: Record<Role, string> = {
  OWNER: "/app/tables",
  ADMIN: "/app/tables",
  WAITER: "/app/tables",
  BARISTA: "/app/catalog",
  PARTNER: "/app",
};

export function getDefaultRoute(role: Role) {
  return defaultRouteByRole[role];
}

const navigationItems = [
  {
    label: "Mesas",
    to: "/app/tables",
    icon: Grid3X3,
    allowedRoles: ["OWNER", "ADMIN", "WAITER"],
  },
  {
    label: "Carta",
    to: "/app/catalog",
    icon: BookOpenText,
    allowedRoles: ["OWNER", "ADMIN", "WAITER", "BARISTA"],
  },
  {
    label: "Gestión",
    to: "/app/management",
    icon: Settings2,
    allowedRoles: ["OWNER", "ADMIN"],
  },
] satisfies readonly AppNavigationItem[];

export function getNavigationItems(role: Role) {
  return navigationItems.filter((item) =>
    item.allowedRoles.some((allowedRole) => allowedRole === role),
  );
}
