import { z } from "zod";

export const jobBoqSchema = z.object({
  job_id: z.string(),
  quantity: z.number().min(0),
  labor_cost: z.number().min(0),
});

export type JobBoqSchemaType = z.infer<typeof jobBoqSchema>;
