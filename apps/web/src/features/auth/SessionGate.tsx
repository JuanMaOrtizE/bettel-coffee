import { Navigate, Outlet, useParams } from "react-router";
import { getDefaultRoute } from "../../app/navigation";
import { LoginPage } from "./LoginPage";
import { useGetMeQuery } from "./auth-api";

export function SessionGate() {
  const { businessSlug } = useParams();
  const { data, error, isLoading } = useGetMeQuery();

  if (!businessSlug) {
    return <Navigate replace to="/" />;
  }

  if (isLoading) {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas px-6">
        <div className="text-center">
          <p className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
            Pathmin
          </p>

          <p className="mt-2 text-sm text-muted" role="status">
            Abriendo {businessSlug.replaceAll("-", " ")}…
          </p>
        </div>
      </main>
    );
  }

  if (data) {
    if (data.user.businessSlug !== businessSlug) {
      return (
        <Navigate
          replace
          to={getDefaultRoute(data.user.role, data.user.businessSlug)}
        />
      );
    }

    return <Outlet context={data.user} />;
  }

  const isUnauthorized = error && "status" in error && error.status === 401;

  if (error && !isUnauthorized) {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas px-6">
        <section className="w-full max-w-md rounded-xl border border-danger/30 bg-surface p-6">
          <h1 className="font-display text-2xl font-bold text-ink">
            No pudimos conectar
          </h1>

          <p className="mt-2 text-muted">
            Verifica que la API esté encendida e inténtalo nuevamente.
          </p>
        </section>
      </main>
    );
  }

  return <LoginPage businessSlug={businessSlug} />;
}
