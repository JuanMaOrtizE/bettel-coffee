import {
  createCategorySchema,
  type CreateCategoryInput,
} from './create-category.schema.js';

export const updateCategorySchema = createCategorySchema;

export type UpdateCategoryInput = CreateCategoryInput;
