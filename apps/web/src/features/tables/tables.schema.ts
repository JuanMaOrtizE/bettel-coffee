import { z } from "zod";

export const tableStatusSchema = z.enum([
  "AVAILABLE",
  "OCCUPIED",
  "PENDING_PAYMENT",
]);

export const cafeTableSchema = z.object({
  id: z.uuid(),
  label: z.string(),
  status: tableStatusSchema,
  isActive: z.boolean(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const cafeTablesSchema = z.array(cafeTableSchema);

export type TableStatus = z.infer<typeof tableStatusSchema>;
export type CafeTable = z.infer<typeof cafeTableSchema>;
