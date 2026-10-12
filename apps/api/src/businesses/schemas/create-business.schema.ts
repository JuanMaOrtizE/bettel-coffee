import { z } from 'zod';

const businessSchema = z
  .object({
    name: z.string().trim().min(1, 'El nombre del negocio es obligatorio'),
    slug: z
      .string()
      .trim()
      .min(1, 'El slug es obligatorio')
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'El slug solo puede contener minúsculas, números y guiones',
      ),
  })
  .strict();

const ownerSchema = z
  .object({
    fullName: z.string().trim().min(1, 'El nombre del OWNER es obligatorio'),
    username: z.string().trim().min(1, 'El usuario del OWNER es obligatorio'),
    password: z
      .string()
      .min(10, 'La contraseña debe tener al menos 10 caracteres')
      .max(128, 'La contraseña no puede superar los 128 caracteres'),
  })
  .strict();

export const createBusinessSchema = z
  .object({
    business: businessSchema,
    owner: ownerSchema,
  })
  .strict();

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
