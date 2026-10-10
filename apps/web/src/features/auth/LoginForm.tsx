import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "./auth-api";
import { loginSchema, type LoginInput } from "./login.schema";

type LoginFormProps = {
  businessSlug: string;
};

export function LoginForm({ businessSlug }: LoginFormProps) {
  const [login, { data, isError, isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      username: "",
      password: "",
    },

    mode: "onBlur",
  });

  const onSubmit = handleSubmit((credentials) => {
    void login({ ...credentials, businessSlug });
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      <div>
        <label className="mb-2 block font-bold text-ink" htmlFor="username">
          Usuario
        </label>

        <input
          {...register("username")}
          className="min-h-12 w-full rounded-lg border border-line bg-surface px-4 text-base text-ink"
          id="username"
          type="text"
          autoComplete="username"
          required
          aria-invalid={Boolean(errors.username)}
          aria-describedby={errors.username ? "username-error" : undefined}
        />

        {errors.username ? (
          <p
            className="mt-2 text-sm text-danger"
            id="username-error"
            role="alert"
          >
            {errors.username.message}
          </p>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block font-bold text-ink" htmlFor="password">
          Contraseña
        </label>

        <input
          {...register("password")}
          className="min-h-12 w-full rounded-lg border border-line bg-surface px-4 text-base text-ink"
          id="password"
          type="password"
          autoComplete="current-password"
          required
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "password-error" : undefined}
        />

        {errors.password ? (
          <p
            className="mt-2 text-sm text-danger"
            id="password-error"
            role="alert"
          >
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {isError ? (
        <p
          className="rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-danger"
          role="alert"
        >
          No pudimos iniciar sesión. Revisa tus credenciales e inténtalo
          nuevamente.
        </p>
      ) : null}

      {data ? (
        <p className="text-sm text-muted" role="status">
          Sesión iniciada como {data.user.fullName}.
        </p>
      ) : null}

      <button
        className="min-h-12 rounded-lg bg-brand px-5 font-bold text-white transition-opacity duration-200 hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        disabled={isLoading}
        aria-busy={isLoading}
      >
        {isLoading ? "Iniciando sesión…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
