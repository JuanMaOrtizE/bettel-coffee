import { z } from 'zod';

export const resetUserPasswordSchema = z
  .object({
    password: z
      .string()
      .min(10, 'La contraseña debe tener al menos 10 caracteres')
      .max(128, 'La contraseña no puede superar los 128 caracteres'),
  })
  .strict();

export type ResetUserPasswordInput = z.infer<typeof resetUserPasswordSchema>;
