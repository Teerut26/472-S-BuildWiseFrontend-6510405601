import { type z } from "zod";
import { jobSchema } from "./job.schema";

export const createJobSchema = jobSchema;

export type CreateJobSchemaType = z.infer<typeof createJobSchema>;
