import { z } from 'zod';
import { Role } from '../../generated/prisma/client.js';

export const createUserSchema = z
  .object({
    fullName: z.string().trim().min(1, 'El nombre es obligatorio'),

    username: z.string().trim().min(1, 'El usuario es obligatorio'),

    password: z
      .string()
      .min(10, 'La contraseña debe tener al menos 10 caracteres')
      .max(128, 'La contraseña no puede superar los 128 caracteres'),

    role: z.enum([Role.ADMIN, Role.WAITER, Role.BARISTA]),
  })
  .strict();

export type CreateUserInput = z.infer<typeof createUserSchema>;
