import { z } from 'zod';

export const createTableSchema = z
  .object({
    label: z
      .string()
      .trim()
      .min(1, 'El identificador de la mesa es obligatorio')
      .max(50, 'El identificador no puede superar los 50 caracteres')
      .transform((label) => label.replace(/\s+/g, ' ')),
  })
  .strict();

export type CreateTableInput = z.infer<typeof createTableSchema>;
