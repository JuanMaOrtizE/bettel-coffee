import { z } from 'zod';
import { Role } from '../../generated/prisma/client.js';

export const updateUserSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'El nombre no puede estar vacío')
      .optional(),

    username: z
      .string()
      .trim()
      .min(1, 'El usuario no puede estar vacío')
      .optional(),

    role: z.enum([Role.ADMIN, Role.WAITER, Role.BARISTA]).optional(),
  })
  .strict()
  .refine((input) => Object.keys(input).length > 0, {
    message: 'Debes enviar al menos un campo para actualizar',
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
