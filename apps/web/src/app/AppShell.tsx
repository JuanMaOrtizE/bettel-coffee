import { Coffee, LogOut } from "lucide-react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useOutletContext,
} from "react-router";
import { getNavigationItems, type AppNavigationItem } from "./navigation";
import { useLogoutMutation } from "../features/auth/auth-api";
import type { AuthenticatedUser, Role } from "../features/auth/auth.types";

type NavigationLinkProps = {
  item: AppNavigationItem;
  mobile?: boolean;
};

const roleLabels: Record<Role, string> = {
  OWNER: "Propietario",
  ADMIN: "Administrador",
  WAITER: "Mesero",
  BARISTA: "Barista",
  PARTNER: "Socio",
};

function NavigationLink({ item, mobile = false }: NavigationLinkProps) {
  const Icon = item.icon;

  return (
    <NavLink
      className={({ isActive }) => {
        const base =
          "flex items-center rounded-lg font-bold transition-colors duration-200 active:opacity-80";

        const layout = mobile
          ? "min-h-14 flex-1 flex-col justify-center gap-1 px-2 text-xs"
          : "min-h-12 gap-3 px-4 text-base";

        const state = isActive
          ? mobile
            ? "bg-brand/10 text-brand"
            : "bg-brand text-white"
          : mobile
            ? "text-muted hover:bg-canvas"
            : "text-surface/75 hover:bg-white/10 hover:text-white";

        return `${base} ${layout} ${state}`;
      }}
      to={item.to}
    >
      <Icon aria-hidden="true" className="size-5 shrink-0" />

      <span>{item.label}</span>
    </NavLink>
  );
}

export function AppShell() {
  const user = useOutletContext<AuthenticatedUser>();
  const navigate = useNavigate();
  const [logout, { isError: isLogoutError, isLoading: isLoggingOut }] =
    useLogoutMutation();
  const navigationItems = getNavigationItems(user.role);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/login", { replace: true });
    } catch {
      // El estado de la mutation muestra el mensaje de error.
    }
  };

  return (
    <div className="min-h-dvh bg-canvas xl:grid xl:grid-cols-[17rem_minmax(0,1fr)]">
      <a
        className="sr-only z-[100] rounded-lg bg-brand px-4 py-3 font-bold text-white focus:fixed focus:left-4 focus:top-4 focus:not-sr-only"
        href="#main-content"
      >
        Saltar al contenido
      </a>

      <aside className="hidden bg-ink text-surface xl:sticky xl:top-0 xl:flex xl:h-dvh xl:flex-col">
        <header className="border-b border-white/10 px-6 py-7">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-lg bg-brand text-white">
              <Coffee aria-hidden="true" className="size-6" />
            </span>

            <div>
              <p className="font-display text-xl font-bold uppercase leading-none tracking-wide">
                Bettel Coffee
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-surface/60">
                Estación de servicio
              </p>
            </div>
          </div>
        </header>

        {navigationItems.length > 0 ? (
          <nav
            aria-label="Navegación principal"
            className="flex flex-1 flex-col gap-2 p-4"
          >
            {navigationItems.map((item) => (
              <NavigationLink item={item} key={item.to} />
            ))}
          </nav>
        ) : (
          <div className="flex-1 px-6 py-5 text-sm text-surface/60">
            No hay secciones disponibles para este rol.
          </div>
        )}

        <footer className="border-t border-white/10 px-6 py-5">
          <p className="truncate font-bold" title={user.fullName}>
            {user.fullName}
          </p>

          <p className="mt-1 text-sm text-surface/60">
            {roleLabels[user.role]}
          </p>

          <button
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/20 px-4 font-bold text-surface transition-colors duration-200 hover:bg-white/10 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            onClick={() => void handleLogout()}
            disabled={isLoggingOut}
          >
            <LogOut aria-hidden="true" className="size-5" />
            {isLoggingOut ? "Cerrando sesión…" : "Cerrar sesión"}
          </button>
        </footer>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-line bg-surface px-4 xl:hidden">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-brand text-white">
              <Coffee aria-hidden="true" className="size-5" />
            </span>

            <p className="font-display text-xl font-bold uppercase tracking-wide text-ink">
              Bettel Coffee
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-2 pl-2">
            <div className="hidden min-w-0 text-right sm:block">
              <p className="max-w-32 truncate text-sm font-bold text-ink">
                {user.fullName}
              </p>

              <p className="text-xs text-muted">{roleLabels[user.role]}</p>
            </div>

            <button
              aria-label={
                isLoggingOut
                  ? "Cerrando sesión"
                  : `Cerrar sesión de ${user.fullName}`
              }
              className="grid size-11 shrink-0 place-items-center rounded-lg border border-line text-ink transition-colors duration-200 hover:bg-canvas active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              type="button"
              title="Cerrar sesión"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
            >
              <LogOut aria-hidden="true" className="size-5" />
            </button>
          </div>
        </header>

        <main
          className="mx-auto min-h-[calc(100dvh-4rem)] w-full max-w-7xl p-4 pb-28 sm:p-6 sm:pb-28 xl:min-h-dvh xl:p-8"
          id="main-content"
          tabIndex={-1}
        >
          {isLogoutError ? (
            <p
              className="mb-4 rounded-lg border border-danger/30 bg-surface p-4 text-sm text-danger"
              role="alert"
            >
              No pudimos cerrar la sesión. Revisa tu conexión e inténtalo
              nuevamente.
            </p>
          ) : null}

          <Outlet context={user} />
        </main>
      </div>

      {navigationItems.length > 0 ? (
        <nav
          aria-label="Navegación móvil"
          className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-line bg-surface px-2 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] xl:hidden"
        >
          {navigationItems.map((item) => (
            <NavigationLink item={item} key={item.to} mobile />
          ))}
        </nav>
      ) : null}
    </div>
  );
}
