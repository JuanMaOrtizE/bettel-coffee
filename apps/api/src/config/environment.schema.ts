import { z } from 'zod';

const environmentSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),

    PORT: z.coerce.number().int().min(1).max(65535).default(3000),

    WEB_ORIGIN: z
      .string()
      .url('WEB_ORIGIN debe ser una URL válida'),

    DATABASE_URL: z.string().min(1, 'DATABASE_URL es obligatoria'),

    JWT_ACCESS_SECRET: z
      .string()
      .min(64, 'JWT_ACCESS_SECRET debe tener al menos 64 caracteres'),

    JWT_REFRESH_SECRET: z
      .string()
      .min(64, 'JWT_REFRESH_SECRET debe tener al menos 64 caracteres'),

    PLATFORM_JWT_ACCESS_SECRET: z
      .string()
      .min(
        64,
        'PLATFORM_JWT_ACCESS_SECRET debe tener al menos 64 caracteres',
      ),

    PLATFORM_JWT_REFRESH_SECRET: z
      .string()
      .min(
        64,
        'PLATFORM_JWT_REFRESH_SECRET debe tener al menos 64 caracteres',
      ),

    JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().positive(),

    JWT_REFRESH_TTL_SECONDS: z.coerce.number().int().positive(),
  })
  .passthrough()
  .refine(
    (environment) =>
      new Set([
        environment.JWT_ACCESS_SECRET,
        environment.JWT_REFRESH_SECRET,
        environment.PLATFORM_JWT_ACCESS_SECRET,
        environment.PLATFORM_JWT_REFRESH_SECRET,
      ]).size === 4,
    {
      message: 'Los cuatro secretos JWT deben ser diferentes',
      path: ['PLATFORM_JWT_ACCESS_SECRET'],
    },
  );

export function validateEnvironment(environment: Record<string, unknown>) {
  return environmentSchema.parse(environment);
}
