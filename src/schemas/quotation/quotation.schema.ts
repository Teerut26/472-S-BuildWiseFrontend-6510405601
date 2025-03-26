import { z } from "zod";

const jobSchema = z.object({
  job_id: z.string(),
  selling_price: z.number().min(0),
});

export const quotationSchema = z.object({
  tax_percentage: z.number().min(0),
  selling_general_cost: z.number().min(0),
  job_selling_prices: z.array(jobSchema),
});

export type QuotationSchemaType = z.infer<typeof quotationSchema>;
