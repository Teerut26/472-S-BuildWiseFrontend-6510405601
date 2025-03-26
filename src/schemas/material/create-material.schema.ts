import { type z } from "zod";
import { materialSchema } from "./material.schema";

export const createMaterialSchema = materialSchema;

export type CreateMaterialSchemaType = z.infer<typeof createMaterialSchema>;