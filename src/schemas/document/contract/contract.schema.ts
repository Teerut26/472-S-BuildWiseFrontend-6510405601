import { z } from "zod";

const periodSchema = z.object({
  amount_period: z
    .number({ required_error: "กรุณากรอกจำนวนเงิน" })
    .min(0, { message: "จำนวนเงินไม่ถูกต้อง" }),
  delivered_within: z
    .number({ required_error: "กรุณาระบุจำนวนวันในการส่งมอบ" })
    .nullable()
    .optional(),
  jobs: z
    .array(
      z.object({
        job_id: z.string(),
        job_amount: z.number({ required_error: "กรุณากรอกจำนวนเงิน" }),
      }),
    )
    .nullable()
    .optional(),
});

export const contractSchema = z.object({
  project_id: z.string({ required_error: "กรุณาเลือกโครงการ" }),
  contract_id: z.string({ required_error: "กรุณาเลือกสัญญา" }),
  project_description: z
    .string({ required_error: "กรุณากรอกรายละเอียดโครงการ" })
    .min(1, {
      message: "กรุณากรอกรายละเอียดโครงการ",
    }),
  area_size: z
    .number({ required_error: "กรุณากรอกขนาดพื้นที่" })
    .min(1, { message: "กรุณากรอกขนาดพื้นที่" }),
  format: z.array(
    z.object({
      value: z.string(),
    }),
    { required_error: "กรุณาเพิ่มรูปแบบและรายการแนบท้ายสัญญา" },
  ),
  periods: z.array(periodSchema),
  start_date: z.date({ required_error: "กรุณาระบุวันเริ่มงาน" }),
  end_date: z.date({ required_error: "กรุณาระบุวันเสร็จสิ้นงาน" }),
  validate_within: z.number({
    required_error: "กรุณาระบุระยะเวลาในการตรวจรับมอบงาน",
  }),
  pay_within: z.number({ required_error: "กรุณาระบุจำนวนวันในการชำระเงิน" }),
  retention_money: z.number({
    required_error: "กรุณาระบุจำนวนเงินประกันผลงาน",
  }),
  guarantee_within: z.number({
    required_error: "กรุณาระบุจำนวนวันในการรับประกันผลงาน",
  }),
  amendment: z
    .string({
      required_error:
        "กรุณาระบุรายละเอียดงานพิเศษและการแก้ไข เพิ่มเติม เปลี่ยนแปลงงาน",
    })
    .min(1, {
      message:
        "กรุณาระบุรายละเอียดงานพิเศษและการแก้ไข เพิ่มเติม เปลี่ยนแปลงงาน",
    }),
  termination_of_contract: z
    .string({
      required_error: "กรุณากรอกเหตุผลในการบอกเลิกสัญญา",
    })
    .min(1, { message: "กรุณากรอกเหตุผลในการบอกเลิกสัญญา" }),
  end_of_contract: z
    .string({
      required_error: "กรุณาระบุเงื่อนไขการสิ้นสุดสัญญา",
    })
    .min(1, { message: "กรุณาระบุเงื่อนไขการสิ้นสุดสัญญา" }),
  breach_of_contract: z
    .string({
      required_error: "กรุณาระบุเงื่อนไขและผลของการผิดสัญญา",
    })
    .min(1, { message: "กรุณาระบุเงื่อนไขและผลของการผิดสัญญา" }),
  force_majeure: z
    .string({
      required_error: "กรุณาระบุเหตุการณ์ที่ถือเป็นเหตุสุดวิสัย",
    })
    .min(1, { message: "กรุณาระบุเหตุการณ์ที่ถือเป็นเหตุสุดวิสัย" }),
});

export const contractFormToApi = contractSchema.transform((data) => {
  return {
    ...data,
    format: data.format.map((item) => item.value),
  };
});

export type ContractSchemaType = z.infer<typeof contractSchema>;
