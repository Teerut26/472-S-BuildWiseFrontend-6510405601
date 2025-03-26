import { z } from "zod";
import { addressSchema } from "../address.schema";

export const clientSchema = z.object({
  name: z.string({ required_error: "กรุณากรอกชื่อ" }).min(1, "กรุณากรอกชื่อ"),
  email: z
    .string({ required_error: "กรุณากรอกอีเมล" })
    .min(1, "กรุณากรอกอีเมล")
    .email({ message: "อีเมลไม่ถูกต้อง" }),
  phone: z
    .string({ required_error: "กรุณากรอกเบอร์โทร" })
    .min(1, "กรุณากรอกเบอร์โทร")
    .refine((value) => {
      return /((0)(\d{1,2}\d{3}\d{4}))/gm.test(value);
    }, "กรุณากรอกเบอร์โทรให้ถูกต้อง"),
  tax_id: z
    .string({ required_error: "กรุณากรอกเลขประจำตัวผู้เสียภาษี" })
    .refine((value) => {
      return value.length === 13;
    }, "กรุณากรอกเลขประจำตัวผู้เสียภาษีให้ถูกต้อง"),
}).merge(addressSchema);

export type ClientSchemaType = z.infer<typeof clientSchema>;
