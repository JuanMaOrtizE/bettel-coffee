import { Coffee } from "lucide-react";
import { LoginForm } from "./LoginForm";

type LoginPageProps = {
  businessSlug: string;
};

function businessNameFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function LoginPage({ businessSlug }: LoginPageProps) {
  const businessName = businessNameFromSlug(businessSlug);

  return (
    <main className="relative min-h-dvh overflow-hidden bg-canvas text-ink">
      <div
        className="absolute inset-y-0 left-0 w-2 bg-brand lg:w-3"
        aria-hidden="true"
      />

      <div className="mx-auto grid min-h-dvh max-w-[1440px] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between px-16 py-14 lg:flex">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full border border-line bg-surface">
              <Coffee aria-hidden="true" size={24} strokeWidth={1.8} />
            </span>

            <div>
              <p className="font-display text-2xl font-bold uppercase tracking-[0.12em]">
                Pathmin
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                Operación diaria
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-brand">
              Estación de servicio
            </p>

            <p className="font-display text-6xl font-bold uppercase leading-[0.92] tracking-tight">
              El café se mueve mejor cuando todo el equipo ve lo mismo.
            </p>

            <p className="mt-7 max-w-lg text-lg leading-8 text-muted">
              Mesas, carta y operación diaria desde un único lugar.
            </p>
          </div>

          <p className="text-sm text-muted">
            Espacio de trabajo: <strong>{businessName}</strong>
          </p>
        </section>

        <section className="flex items-center border-line bg-surface px-6 py-10 sm:px-10 lg:border-l lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <span className="grid size-11 place-items-center rounded-full border border-line">
                <Coffee aria-hidden="true" size={22} strokeWidth={1.8} />
              </span>

              <div>
                <p className="font-display text-xl font-bold uppercase tracking-[0.12em]">
                  Pathmin
                </p>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                  Operación diaria
                </p>
              </div>
            </div>

            <header className="mb-8">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-brand">
                {businessName}
              </p>

              <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-tight">
                Inicia tu turno
              </h1>

              <p className="mt-4 max-w-sm text-muted">
                Usa las credenciales asignadas por administración.
              </p>
            </header>

            <LoginForm businessSlug={businessSlug} />
          </div>
        </section>
      </div>
    </main>
  );
}
