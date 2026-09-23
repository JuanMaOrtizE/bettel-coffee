import { z } from 'zod';

const environmentSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),

    PORT: z.coerce.number().int().min(1).max(65535).default(3000),

    DATABASE_URL: z.string().min(1, 'DATABASE_URL es obligatoria'),

    JWT_ACCESS_SECRET: z
      .string()
      .min(64, 'JWT_ACCESS_SECRET debe tener al menos 64 caracteres'),

    JWT_REFRESH_SECRET: z
      .string()
      .min(64, 'JWT_REFRESH_SECRET debe tener al menos 64 caracteres'),

    JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive(),

    JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive(),
  })
  .passthrough()
  .refine(
    (environment) =>
      environment.JWT_ACCESS_SECRET !== environment.JWT_REFRESH_SECRET,
    {
      message: 'Los secretos de access y refresh deben ser diferentes',
      path: ['JWT_REFRESH_SECRET'],
    },
  );

export function validateEnvironment(environment: Record<string, unknown>) {
  return environmentSchema.parse(environment);
}
