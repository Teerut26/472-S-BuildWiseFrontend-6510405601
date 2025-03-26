import { z } from "zod";

export const materialSchema = z.object({
  name: z
    .string({ required_error: "กรุณากรอกชื่อวัสดุ" })
    .min(1, "กรุณากรอกชื่อวัสดุ"),
  unit: z
    .string({ required_error: "กรุณากรอกหน่วยวัสดุ" })
    .min(1, "กรุณากรอกหน่วยวัสดุ"),
});

export type MaterialSchemaType = z.infer<typeof materialSchema>;
