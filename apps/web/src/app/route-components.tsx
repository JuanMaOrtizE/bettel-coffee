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

  return <Navigate replace to={getDefaultRoute(user.role)} />;
}

export function AppIndex() {
  const user = useOutletContext<AuthenticatedUser>();

  if (user.role !== "PARTNER") {
    return <Navigate replace to={getDefaultRoute(user.role)} />;
  }

  return (
    <RoutePlaceholder
      title="Bettel Coffee"
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
