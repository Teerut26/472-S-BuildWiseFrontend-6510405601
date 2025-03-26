import BackButton from "@/components/BackButton/BackButton";
import useGetCompanyByUser from "@/hooks/queries/company/useGetCompanyByUser";
import useGetProject from "@/hooks/queries/project/useGetProject";
import { Badge, Box, Button, Divider, LoadingOverlay, Text } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import _ from "lodash";
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import InvoicePdfView from "@/components/Document/Invoice/InvoicePdfView";
import useGetInvoice from "@/hooks/queries/invoice/useGetInvoice";
import { getInvoiceStatusMap } from "@/utils/invoiceStatusMap";
import { modals } from "@mantine/modals";
import useEditInvoiceStatus from "@/hooks/mutates/invoice/useEditInvoiceStatus";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";

export default function Contract(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
    const { data: session } = useSession();
    const getProject = useGetProject({ id: props.project_id ?? "" });
    const getCompanyByUser = useGetCompanyByUser({ user_id: session?.user?.id ?? "" });
    const getInvoice = useGetInvoice({ invoice_id: props.invoice_id ?? "" });
    const editInvoiceStatus = useEditInvoiceStatus();

    const onChangeStatus = () => {
        modals.openConfirmModal({
            title: "ยืนยันการเปลี่ยนสถานะ",
            centered: true,
            children: (
                <div className="flex items-center gap-1">
                    คุณต้องการเปลี่ยนสถานะเป็น <Badge>อนุมัติ</Badge> ใช่หรือไม่ ?
                </div>
            ),
            labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
            onConfirm: () => {
                editInvoiceStatus.mutate({
                    invoice_id: props.invoice_id ?? "",
                    status: "approved",
                }, {
                    onSuccess: () => {
                        notifications.show({
                            title: "สําเร็จ",
                            message: "เปลี่ยนสถานะสัญญาสําเร็จ",
                            color: "green",
                        });
                        getInvoice.refetch();
                    },
                    onError: (error) => {
                        if (error instanceof AxiosError) {
                            notifications.show({
                                title: "เกิดข้อผิดพลาด",
                                message: error.response?.data.error,
                                color: "red",
                            });
                        }
                    },
                })
            },
        })
    }

    const isApproved = getInvoice.data?.data.status === "approved";

    return (
        <div className="flex flex-col">
            <BackButton label="กลับไปหน้าเอกสาร" href={`/project/${props.project_id}/document`} />
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <div className="text-xl font-bold">
                        <div className="flex items-center gap-2">
                            ใบแจ้งหนี้งวดที่ {getInvoice.data?.data.period.period_number}
                            <Badge variant="dot">
                                {getInvoiceStatusMap(getInvoice.data?.data.status ?? "")?.label}
                            </Badge>
                        </div>
                    </div>
                    <Text size="md" fw={700}>
                        {getProject.data?.data.name}
                    </Text>
                </div>
                <div className="flex gap-2">
                    {isApproved ? <a
                        target="_blank"
                        href={`/api/report/document/invoice/${props.invoice_id}?user_id=${session?.user.id}&project_id=${props.project_id}`}
                    >
                        <Button
                            variant="default"
                            leftSection={<IconFileText size={15} />}
                        >
                            Export
                        </Button>
                    </a> : <Button
                        variant="default"
                        leftSection={<IconFileText size={15} />}
                        disabled
                    >
                        Export
                    </Button>}

                    {getInvoice.data?.data.status === "draft" ? <Link href={`/project/${props.project_id}/document/invoice/${props.invoice_id}/edit`}>
                        <Button>
                            แก้ไข
                        </Button>
                    </Link> : <Button disabled>แก้ไข</Button>}
                    {isApproved ? <Button disabled>เปลี่ยนสถานะ</Button> : <Button onClick={onChangeStatus}>
                        เปลี่ยนสถานะ
                    </Button>}
                </div>
            </div>
            <Divider my={"md"} />
            <Box pos="relative">
                <LoadingOverlay loaderProps={{ children: 'Loading...' }} />
                {(getProject.data?.data && getCompanyByUser.data?.data && getInvoice.data) ? <InvoicePdfView
                    data={getInvoice.data?.data}
                    isPrintMode={false}
                    project={getProject.data?.data}
                    company={getCompanyByUser.data?.data}
                /> : <div className="flex justify-center">
                    <Text size="xl">ไม่พบข้อมูลใบแจ้งหนี้</Text>
                </div>}
            </Box>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            project_id: context.query.id?.toString(),
            invoice_id: context.query.invoice_id?.toString(),
        },
    };
}
