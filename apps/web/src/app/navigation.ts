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

type NavigationDefinition = Omit<AppNavigationItem, "to"> & {
  path: string;
};

const defaultPathByRole: Record<Role, string> = {
  OWNER: "/app/tables",
  ADMIN: "/app/tables",
  WAITER: "/app/tables",
  BARISTA: "/app/catalog",
  PARTNER: "/app",
};

function getBusinessPath(businessSlug: string, path: string) {
  return `/b/${encodeURIComponent(businessSlug)}${path}`;
}

export function getDefaultRoute(role: Role, businessSlug: string) {
  return getBusinessPath(businessSlug, defaultPathByRole[role]);
}

const navigationItems = [
  {
    label: "Mesas",
    path: "/app/tables",
    icon: Grid3X3,
    allowedRoles: ["OWNER", "ADMIN", "WAITER"],
  },
  {
    label: "Carta",
    path: "/app/catalog",
    icon: BookOpenText,
    allowedRoles: ["OWNER", "ADMIN", "WAITER", "BARISTA"],
  },
  {
    label: "Gestión",
    path: "/app/management",
    icon: Settings2,
    allowedRoles: ["OWNER", "ADMIN"],
  },
] satisfies readonly NavigationDefinition[];

export function getNavigationItems(role: Role, businessSlug: string) {
  return navigationItems
    .filter((item) =>
      item.allowedRoles.some((allowedRole) => allowedRole === role),
    )
    .map(({ path, ...item }) => ({
      ...item,
      to: getBusinessPath(businessSlug, path),
    }));
}
