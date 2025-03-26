import { z } from "zod";

export const materialProjectEstimateSchema = z.object({
  name: z.string(),
  material_id: z.string(),
  estimated_price: z.number().min(0).optional(),
});

export type MaterialProjectEstimateSchemaType = z.infer<
  typeof materialProjectEstimateSchema
>;
