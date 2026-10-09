import {
  AlertTriangle,
  RefreshCw,
  TableProperties,
} from "lucide-react";
import { TableCard } from "./TableCard";
import { useGetTablesQuery } from "./tables-api";

function TablesLoading() {
  return (
    <section aria-busy="true" aria-label="Cargando mesas">
      <div className="h-8 w-48 animate-pulse rounded bg-line" />

      <div className="mt-3 h-5 w-72 max-w-full animate-pulse rounded bg-line" />

      <div className="mt-8 grid grid-cols-2 justify-items-center gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
        {Array.from({ length: 10 }, (_, index) => (
          <div
            key={index}
            className="flex w-full max-w-52 flex-col items-center"
          >
            <div className="h-36 w-full animate-pulse rounded-[40%] bg-line/60 sm:h-40 xl:h-44" />
            <div className="mt-2 h-7 w-24 animate-pulse rounded bg-line" />
            <div className="mt-2 h-8 w-28 animate-pulse rounded-full bg-line" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function TablesPage() {
  const {
    data: tables = [],
    isLoading,
    isError,
    refetch,
  } = useGetTablesQuery();

  if (isLoading) {
    return <TablesLoading />;
  }

  if (isError) {
    return (
      <section className="rounded-xl border border-danger/30 bg-surface p-6 sm:p-8">
        <AlertTriangle
          aria-hidden="true"
          className="size-8 text-danger"
        />

        <h1 className="mt-4 font-display text-3xl font-bold text-ink">
          No pudimos cargar las mesas
        </h1>

        <p className="mt-2 max-w-xl text-muted">
          Comprueba que la API esté funcionando e inténtalo nuevamente.
        </p>

        <button
          type="button"
          className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-lg bg-brand px-5 font-bold text-surface transition-opacity hover:opacity-90 active:opacity-80"
          onClick={() => void refetch()}
        >
          <RefreshCw aria-hidden="true" className="size-5" />
          Intentar nuevamente
        </button>
      </section>
    );
  }

  const activeTableCount = tables.filter(
    (table) => table.isActive,
  ).length;

  return (
    <section>
      <header className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">
            Salón
          </p>

          <h1 className="mt-1 font-display text-4xl font-bold text-ink sm:text-5xl">
            Mesas
          </h1>

          <p className="mt-2 max-w-2xl text-muted">
            Consulta la disponibilidad actual del café.
          </p>
        </div>

        {tables.length > 0 && (
          <p className="text-sm font-bold text-muted">
            {activeTableCount} de {tables.length} activas
          </p>
        )}
      </header>

      {tables.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-line bg-surface p-8 text-center">
          <TableProperties
            aria-hidden="true"
            className="mx-auto size-10 text-muted"
          />

          <h2 className="mt-4 font-display text-3xl font-bold text-ink">
            Todavía no hay mesas
          </h2>

          <p className="mx-auto mt-2 max-w-md text-muted">
            Cuando se registren mesas para el café, aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 justify-items-center gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {tables.map((table) => (
            <TableCard key={table.id} table={table} />
          ))}
        </div>
      )}
    </section>
  );
}
