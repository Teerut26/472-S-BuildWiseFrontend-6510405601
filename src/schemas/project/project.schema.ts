import { z } from "zod";
import { addressSchema } from "../address.schema";

export const projectSchema = z
  .object({
    project_name: z
      .string({ required_error: "กรุณากรอกชื่อโครงการ" })
      .min(1, "กรุณากรอกชื่อโครงการ"),
    project_details: z
      .string({ required_error: "กรุณากรอกรายละเอียดโครงการ" })
      .min(1, "กรุณากรอกรายละเอียดโครงการ"),
    client_id: z.string({ required_error: "กรุณาเลือกลูกค้า" }).optional(),
  })
  .merge(addressSchema);

export type ProjectSchemaType = z.infer<typeof projectSchema>;
