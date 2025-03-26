import { z } from "zod";
import { boqGeneralCostSchema } from "./boq-general-cost.schema";

export const createBoqGeneralCostSchema = boqGeneralCostSchema;

export type CreateBoqGeneralCostSchemaType = z.infer<
  typeof createBoqGeneralCostSchema
>;
