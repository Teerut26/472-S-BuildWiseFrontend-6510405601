import { z } from "zod";
import { generalCostSchema } from "./generalCost.schema";

export const actualGeneralCostSchema = z
  .object({
    actual_cost: z.number(),
  })
  .merge(generalCostSchema);

export type ActualGeneralCostSchemaType = z.infer<
  typeof actualGeneralCostSchema
>;
