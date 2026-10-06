import { z } from 'zod';

export const createProductSchema = z
  .object({
    categoryId: z.uuid(),

    name: z
      .string()
      .trim()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(100, 'El nombre no puede superar los 100 caracteres')
      .transform((name) => name.replace(/\s+/g, ' ')),

    price: z
      .string()
      .trim()
      .regex(
        /^(?:0|[1-9]\d{0,9})(?:\.\d{1,2})?$/,
        'El precio debe ser un decimal válido con máximo 2 decimales',
      )
      .refine(
        (price) => !['0', '0.0', '0.00'].includes(price),
        'El precio debe ser mayor que cero',
      ),
  })
  .strict();

export type CreateProductInput = z.infer<typeof createProductSchema>;
