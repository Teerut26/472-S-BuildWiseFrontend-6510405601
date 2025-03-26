import { z } from "zod";

export const documentSchema = z.object({
  project_id: z.string(),
  file_url: z.string().url(),
});

export type DocumentSchemaType = z.infer<typeof documentSchema>;
