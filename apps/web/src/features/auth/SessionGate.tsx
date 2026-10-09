import { Outlet } from "react-router";
import { LoginPage } from "./LoginPage";
import { useGetMeQuery } from "./auth-api";

export function SessionGate() {
  const { data, error, isLoading } = useGetMeQuery();

  if (isLoading) {
    return (
      <main className="grid min-h-dvh place-items-center bg-canvas px-6">
        <div className="text-center">
          <p className="font-display text-2xl font-bold uppercase tracking-wide text-ink">
            Bettel Coffee
          </p>

          <p className="mt-2 text-sm text-muted" role="status">
            Recuperando tu sesión…
          </p>
        </div>
      </main>
    );
  }

  if (data) {
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

  return <LoginPage />;
}
