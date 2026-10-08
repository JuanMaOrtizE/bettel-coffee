import {
  createTableSchema,
  type CreateTableInput,
} from './create-table.schema.js';

export const updateTableSchema = createTableSchema;

export type UpdateTableInput = CreateTableInput;
