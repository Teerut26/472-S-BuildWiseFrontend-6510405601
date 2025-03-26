import { z } from "zod";

export const boqGeneralCostSchema = z.object({
  g_id: z.string(),
  type_name: z.string(),
  estimated_cost: z.number().min(0),
});

export type BoqGeneralCostSchemaType = z.infer<typeof boqGeneralCostSchema>;
