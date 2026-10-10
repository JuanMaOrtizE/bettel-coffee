import { createBrowserRouter } from "react-router";
import { AppShell } from "./AppShell";
import { RoleRoute } from "./RoleRoute";
import {
  AppIndex,
  CatalogPlaceholder,
  ManagementPlaceholder,
  RoleHomeRedirect,
  TenantAccessPage,
} from "./route-components";
import { SessionGate } from "../features/auth/SessionGate";
import { TablesPage } from "../features/tables/TablesPage";

export const router = createBrowserRouter([
  {
    path: "b/:businessSlug",
    Component: SessionGate,
    children: [
      {
        Component: AppShell,
        children: [
          {
            index: true,
            Component: RoleHomeRedirect,
          },
          {
            path: "login",
            Component: RoleHomeRedirect,
          },
          {
            element: <RoleRoute allowedRoles={["PARTNER"]} />,
            children: [
              {
                path: "app",
                Component: AppIndex,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["OWNER", "ADMIN", "WAITER"]} />,
            children: [
              {
                path: "app/tables",
                Component: TablesPage,
              },
            ],
          },
          {
            element: (
              <RoleRoute
                allowedRoles={["OWNER", "ADMIN", "WAITER", "BARISTA"]}
              />
            ),
            children: [
              {
                path: "app/catalog",
                Component: CatalogPlaceholder,
              },
            ],
          },
          {
            element: <RoleRoute allowedRoles={["OWNER", "ADMIN"]} />,
            children: [
              {
                path: "app/management/*",
                Component: ManagementPlaceholder,
              },
            ],
          },
          {
            path: "*",
            Component: RoleHomeRedirect,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    Component: TenantAccessPage,
  },
]);
