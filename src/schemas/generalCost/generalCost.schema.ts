import { z } from "zod";

export const generalCostSchema = z.object({
  g_id: z.string(),
  type_name: z.string(),
});

export type GeneralCostSchemaType = z.infer<typeof generalCostSchema>;
