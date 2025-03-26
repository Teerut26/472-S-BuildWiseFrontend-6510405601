import { format } from "date-fns";
import { z } from "zod";

export const invoiceSchema = z.object({
  invoice_date: z.date({ required_error: "กรุณาระบุวันที่ออกใบแจ้งหนี้" }),
  payment_due_date: z.date({ required_error: "กรุณาระบุวันที่ครบกำหนดชำระ" }),
  paid_date: z.date({ required_error: "กรุณาระบุวันที่ชำระเงิน" }),
  payment_term: z
    .string({ required_error: "กรุณาระบุเงื่อนไขการชำระเงิน" })
    .min(1, {
      message: "กรุณาระบุเงื่อนไขการชำระเงิน",
    }),
  remarks: z.string({ required_error: "กรุณาระบุหมายเหตุ" }).min(1, {
    message: "กรุณาระบุหมายเหตุ",
  }),
  retention: z
    .number({ required_error: "กรุณาระบุจำนวนเงินประกันผลงาน" })
    .optional(),
});

export const invoiceFormToApi = invoiceSchema.transform((data) => {
  return {
    invoice_date: format(data.invoice_date, "yyyy-MM-dd"),
    payment_due_date: format(data.payment_due_date, "yyyy-MM-dd"),
    paid_date: format(data.paid_date, "yyyy-MM-dd"),
    payment_term: data.payment_term,
    remarks: data.remarks,
    retention: data.retention,
  };
});

export type InvoiceSchemaType = z.infer<typeof invoiceSchema>;
