import ControlledDatePicker from "@/components/Controlled/ControlledDatePicker";
import ControlledInputNumber from "@/components/Controlled/ControlledInputNumber";
import ControlledInputTextarea from "@/components/Controlled/ControlledInputTextarea";
import { invoiceSchema, type InvoiceSchemaType } from "@/schemas/document/invoice/invoice.schema";
import { type GetInvoiceResponse } from "@/services/invoice/getInvoice.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, NumberFormatter, Paper, Stack, Text } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
    type: "create" | "edit";
    onFinish?: (data: InvoiceSchemaType) => void;
    data?: InvoiceSchemaType;
    invoice_date: GetInvoiceResponse
}

export default function InvoiceForm(props: Props) {
    const invoice_date = props.invoice_date;

    const {
        control,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<InvoiceSchemaType>({
        resolver: zodResolver(invoiceSchema),
    });

    const onFinish = (data: InvoiceSchemaType) => {
        console.log(data);
        props.onFinish?.(data);
    };

    useEffect(() => {
        if (props.data) {
            setValue("invoice_date", props.data.invoice_date);
            setValue("payment_due_date", props.data.payment_due_date);
            setValue("paid_date", props.data.paid_date);
            setValue("retention", props.data.retention);
            setValue("payment_term", props.data.payment_term);
            setValue("remarks", props.data.remarks);
        }

    }, [props.data]);

    console.log(errors);


    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
            <Paper withBorder p="md">
                <Stack>
                    <Group justify="center">
                        <Stack gap={5} align="center">
                            <Text>จำนวนเงินสุทธิของใบแจ้งหนี้งวดที่ {invoice_date.period.period_number}</Text>
                            <NumberFormatter suffix=" บาท" className="font-bold" value={(invoice_date.period.amount_period - (watch("retention") ?? 0)).toFixed(2)} thousandSeparator />
                        </Stack>
                    </Group>
                </Stack>
            </Paper>
            <Group>
                <ControlledDatePicker
                    control={control}
                    name="invoice_date"
                    props={{
                        label: "วันที่ออกใบแจ้งหนี้",
                        placeholder: "กรุณาระบุวันที่ออกใบแจ้งหนี้",
                        withAsterisk: true,
                    }}
                />
                <ControlledDatePicker
                    control={control}
                    name="payment_due_date"
                    props={{
                        label: "วันที่ครบกำหนดชำระ",
                        placeholder: "กรุณาระบุวันที่ครบกำหนดชำระ",
                        withAsterisk: true,
                    }}
                />
                <ControlledDatePicker
                    control={control}
                    name="paid_date"
                    props={{
                        label: "วันที่ชำระเงิน",
                        placeholder: "กรุณาระบุวันที่ชำระเงิน",
                        withAsterisk: true,
                    }}
                />
            </Group>
            <ControlledInputNumber
                control={control}
                name="retention"
                props={{
                    label: "เงินประกันผลงาน",
                    placeholder: "กรุณาระบุเงินประกันผลงาน",
                    thousandSeparator: true,
                    suffix: " บาท",
                    withAsterisk: true,
                }}
            />
            <ControlledInputTextarea
                control={control}
                name="payment_term"
                props={{
                    label: "เงื่อนไขการชำระเงิน",
                    placeholder: "กรุณาระบุเงื่อนไขการชำระเงิน",
                    withAsterisk: true,
                }}
            />
            <ControlledInputTextarea
                control={control}
                name="remarks"
                props={{
                    label: "หมายเหตุ",
                    placeholder: "กรุณาระบุหมายเหตุ",
                    withAsterisk: true,
                }}
            />
            <div>
                <Button type="submit">
                    {props.type === "create" ? "สร้าง" : "บันทึก"}
                </Button>
            </div>
        </form>
    );
}
