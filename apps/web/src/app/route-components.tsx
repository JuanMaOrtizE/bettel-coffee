import { Navigate, useOutletContext } from "react-router";
import { getDefaultRoute } from "./navigation";
import type { AuthenticatedUser } from "../features/auth/auth.types";

type RoutePlaceholderProps = {
  title: string;
  description: string;
};

function RoutePlaceholder({
  title,
  description,
}: RoutePlaceholderProps) {
  return (
    <section className="rounded-xl border border-line bg-surface p-6 sm:p-8">
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">
        Módulo
      </p>

      <h1 className="mt-2 font-display text-4xl font-bold text-ink">
        {title}
      </h1>

      <p className="mt-3 max-w-2xl text-muted">{description}</p>
    </section>
  );
}

export function RoleHomeRedirect() {
  const user = useOutletContext<AuthenticatedUser>();

  return (
    <Navigate
      replace
      to={getDefaultRoute(user.role, user.businessSlug)}
    />
  );
}

export function AppIndex() {
  const user = useOutletContext<AuthenticatedUser>();

  if (user.role !== "PARTNER") {
    return (
      <Navigate
        replace
        to={getDefaultRoute(user.role, user.businessSlug)}
      />
    );
  }

  return (
    <RoutePlaceholder
      title={user.businessName}
      description="La consulta financiera para socios estará disponible en una fase posterior."
    />
  );
}

export function CatalogPlaceholder() {
  return (
    <RoutePlaceholder
      title="Carta"
      description="Aquí aparecerán las categorías y los productos disponibles."
    />
  );
}

export function ManagementPlaceholder() {
  return (
    <RoutePlaceholder
      title="Gestión"
      description="Aquí administraremos usuarios, categorías y productos."
    />
  );
}

export function TenantAccessPage() {
  return (
    <main className="grid min-h-dvh place-items-center bg-canvas px-6 text-ink">
      <section className="w-full max-w-lg border-l-4 border-brand bg-surface p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">
          Pathmin
        </p>

        <h1 className="mt-3 font-display text-4xl font-bold uppercase leading-none">
          Usa el enlace de tu negocio
        </h1>

        <p className="mt-4 leading-7 text-muted">
          Cada negocio tiene una dirección propia. Solicita a tu administrador
          el enlace de acceso correspondiente.
        </p>
      </section>
    </main>
  );
}
