import BackButton from "@/components/BackButton/BackButton";
import useGetContractByProject from "@/hooks/queries/contract/useGetContractByProject";
import useGetInvoiceListByProjectId from "@/hooks/queries/invoice/useGetInvoiceListByProjectId";
import useGetProject from "@/hooks/queries/project/useGetProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import { getInvoiceStatusMap } from "@/utils/invoiceStatusMap";
import {
    Badge,
    Button,
    Drawer,
    Group,
    List,
    NumberFormatter,
    Paper,
    Stack,
    Text,
    ThemeIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCircleCheck, IconCircleDashed, IconContract, IconFile, IconReceipt } from "@tabler/icons-react";
import {
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType,
} from "next";
import Link from "next/link";

export default function Document(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
    const getProject = useGetProject({ id: props.id ?? "" });
    const getQuotationByProject = useGetQuotationByProject({ project_id: props.id ?? "" });
    const getContractByProject = useGetContractByProject({ project_id: props.id ?? "" });

    const quotationStatus = getQuotationByProject.data?.data.status;
    const contractStatus = getContractByProject.data?.status

    const isContractAvailable = quotationStatus === "approved" && contractStatus !== "approved";

    const [openedInvoiceList, { open: openInvoiceList, close: closeInvoiceList }] = useDisclosure(false);

    const getInvoiceListByProjectId = useGetInvoiceListByProjectId({ project_id: props.id ?? "" });

    const contractIsApprove = getContractByProject.data?.status === "approved";

    return (
        <>
            <Drawer position="right" opened={openedInvoiceList} onClose={closeInvoiceList} title={<Text size="xl" fw="bold">รายการใบแจ้งหนี้</Text>}>
                <Stack gap="sm">
                    {getInvoiceListByProjectId.data?.data?.map((invoice) => (
                        <Link key={invoice.invoice_id} href={`/project/${props.id}/document/invoice/${invoice.invoice_id}`} target="_blank">
                            <Paper withBorder p="xs" className="cursor-pointer" >
                                <Group>
                                    <ThemeIcon color="blue" size={24} >
                                        <IconFile size={16} />
                                    </ThemeIcon>
                                    <Stack gap={0}>
                                        <Group gap="xs">
                                            <Text fw="bold">
                                                <span>ใบแจ้งหนี้งวดที่</span>
                                                <span className="ml-2">{invoice.period.period_number}</span>
                                            </Text>
                                            <Badge variant="dot">
                                                {getInvoiceStatusMap(invoice.status ?? "")?.label}
                                            </Badge>
                                        </Group>
                                        <Text size="sm" c="dimmed">
                                            <NumberFormatter value={invoice.period.amount_period} thousandSeparator prefix="จำนวนเงิน " suffix=" บาท" />
                                        </Text>
                                    </Stack>
                                </Group>
                            </Paper>
                        </Link>
                    ))}
                </Stack>
            </Drawer>
            <div className="flex flex-col">
                <BackButton label="ย้อนกลับไปหน้ารายละเอียดโครงการ" href={`/project/${props.id}`} />
                <div className="flex flex-col">
                    <div className="text-xl font-bold">
                        <div className="flex items-center gap-2">
                            เอกสาร
                        </div>
                    </div>
                    <Text size="md" fw={700}>
                        {getProject.data?.data.name}
                    </Text>
                </div>
                <div className="flex gap-5 mt-3">
                    {isContractAvailable ? <Link href={`/project/${props.id}/document/contract`}>
                        <Button leftSection={<IconContract />} variant="outline" size="xl">สัญญา</Button>
                    </Link> : <Button leftSection={<IconContract />} variant="outline" size="xl" disabled>สัญญา</Button>}

                    {/* <Link href={`/project/${props.id}/document/invoice`}>
                        <Button leftSection={<IconReceipt />} variant="outline" size="xl">ใบแจ้งหนี้</Button>
                    </Link> */}
                    <Button disabled={!contractIsApprove} leftSection={<IconReceipt />} variant="outline" size="xl" onClick={openInvoiceList} >
                        ใบแจ้งหนี้
                    </Button>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            id: context.query.id?.toString(),
        },
    };
}
