import BackButton from "@/components/BackButton/BackButton";
import useGetProject from "@/hooks/queries/project/useGetProject";
import { Divider, Text } from "@mantine/core";
import _ from "lodash";
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";
import InvoiceForm from "@/components/Document/Invoice/InvoiceForm";
import { invoiceFormToApi, type InvoiceSchemaType } from "@/schemas/document/invoice/invoice.schema";
import useEditInvoice from "@/hooks/mutates/invoice/useEditInvoice";
import useGetInvoice from "@/hooks/queries/invoice/useGetInvoice";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";

export default function InvoiceEdit(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
    const getProject = useGetProject({ id: props.id ?? "" });
    const getInvoice = useGetInvoice({ invoice_id: props.invoice_id ?? "" });
    const editInvoice = useEditInvoice();

    const onSave = (data: InvoiceSchemaType) => {
        try {
            const result = invoiceFormToApi.parse(data);
            editInvoice.mutate({
                invoice_id: props.invoice_id ?? "",
                ...result,
            },
                {
                    onSuccess: async () => {
                        await getInvoice.refetch();
                        notifications.show({
                            title: "สําเร็จ",
                            message: `แก้ไขใบแจ้งหนี้งวดที่ ${getInvoice.data?.data.period.period_number} สําเร็จ`,
                            color: "green",
                        });
                    },
                    onError: (error) => {
                        if (error instanceof AxiosError) {
                            notifications.show({
                                title: "เกิดข้อผิดพลาด",
                                message: error.response?.data.error,
                                color: "red",
                            })
                        }
                    }
                },

            )
        } catch (error) {
            if (error instanceof Error) {
                notifications.show({
                    title: "เกิดข้อผิดพลาด",
                    message: error.message,
                    color: "red",
                })
            }
        }
    }

    return (
        <div className="flex flex-col">
            <BackButton label="กลับไปหน้ารายละเอียดใบแจ้งหนี้" />
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <div className="text-xl font-bold">
                        <div className="flex items-center gap-2">
                            แก้ไขใบแจ้งหนี้งวดที่ {getInvoice.data?.data.period.period_number}
                        </div>
                    </div>
                    <Text size="md" fw={700}>
                        {getProject.data?.data.name}
                    </Text>
                </div>
                <div className="flex gap-2">
                </div>
            </div>
            <Divider my={"md"} />
            {(props.invoice_id && getInvoice.data?.data) && <InvoiceForm
                type="edit"
                invoice_date={getInvoice.data.data}
                data={{
                    ...getInvoice.data?.data,
                    invoice_date: new Date(getInvoice.data?.data.invoice_date),
                    payment_due_date: new Date(getInvoice.data?.data.payment_due_date),
                    paid_date: new Date(getInvoice.data?.data.paid_date),
                }}
                onFinish={onSave}
            />}
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            id: context.query.id?.toString(),
            invoice_id: context.query.invoice_id?.toString(),
        },
    };
}
