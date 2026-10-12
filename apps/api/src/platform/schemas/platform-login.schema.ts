import { z } from 'zod';

export const platformLoginSchema = z
  .object({
    username: z.string().trim().min(1, 'El usuario es obligatorio'),
    password: z.string().min(1, 'La contraseña es obligatoria'),
  })
  .strict();

export type PlatformLoginInput = z.infer<typeof platformLoginSchema>;
