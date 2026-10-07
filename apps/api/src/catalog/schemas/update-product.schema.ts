import { z } from 'zod';
import { createProductSchema } from './create-product.schema.js';

export const updateProductSchema = createProductSchema.partial().refine(
  (input) => Object.keys(input).length > 0,
  'Debes enviar al menos un campo para actualizar',
);

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
