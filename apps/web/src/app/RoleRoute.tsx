import {
  Navigate,
  Outlet,
  useOutletContext,
} from "react-router";
import { getDefaultRoute } from "./navigation";
import type {
  AuthenticatedUser,
  Role,
} from "../features/auth/auth.types";

type RoleRouteProps = {
  allowedRoles: readonly Role[];
};

export function RoleRoute({
  allowedRoles,
}: RoleRouteProps) {
  const user = useOutletContext<AuthenticatedUser>();

  const isAllowed = allowedRoles.includes(user.role);

  if (!isAllowed) {
    return (
      <Navigate
        replace
        to={getDefaultRoute(user.role, user.businessSlug)}
      />
    );
  }

  return <Outlet context={user} />;
}
