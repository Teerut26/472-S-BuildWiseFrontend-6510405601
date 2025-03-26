import { z } from "zod";

export const addressSchema = z.object({
  address: z
    .string({ required_error: "กรุณากรอกที่อยู่" })
    .min(1, "กรุณากรอกที่อยู่"),
  subdistrict: z
    .string({ required_error: "กรุณากรอกตำบลหรือแขวง" })
    .min(1, "กรุณากรอกตำบลหรือแขวง"),
  district: z
    .string({ required_error: "กรุณากรอกอําเภอหรือเขต" })
    .min(1, "กรุณากรอกอําเภอหรือเขต"),
  province: z
    .string({ required_error: "กรุณากรอกจังหวัด" })
    .min(1, "กรุณากรอกจังหวัด"),
  postal_code: z
    .string({ required_error: "กรุณากรอกรหัสไปรษณีย์" })
    .refine((value) => {
      return value.length === 5;
    }, "กรุณากรอกรหัสไปรษณีย์ให้ถูกต้อง"),
});

export type AddressSchemaType = z.infer<typeof addressSchema>;
