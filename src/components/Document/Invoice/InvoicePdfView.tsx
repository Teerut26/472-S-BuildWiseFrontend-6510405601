import { type GetCompanyByUserResponse } from "@/services/company/getCompanyByUser.service";
import { type GetInvoiceResponse } from "@/services/invoice/getInvoice.service";
import { type GetProjectResponse } from "@/services/project/getProject.service";
import { Group, NumberFormatter, Stack, Table } from "@mantine/core";
import { parseISO } from "date-fns";
import dayjs from "dayjs";
import buddhistEra from 'dayjs/plugin/buddhistEra'
import _ from "lodash";

dayjs.extend(buddhistEra);

interface Props {
    isPrintMode: boolean;
    data: GetInvoiceResponse
    project: GetProjectResponse
    company: GetCompanyByUserResponse
}

export default function InvoicePdfView(props: Props) {
    const project = props.project;
    const invoice = props.data;

    return (
        <div className="text-[14px]">
            <Group justify="space-between" align="self-start" mt={5}>
                <Group>
                    <Stack gap={0}>
                        <div className="text-xl font-bold">{props.company.name}</div>
                        <div>{[props.company.address.address, props.company.address.subdistrict, props.company.address.district, props.company.address.province, props.company.address.postal_code].filter(Boolean).join(', ')}</div>
                        <div>เลขประจำตัวผู้เสียภาษี: <span className="font-medium">{props.company.tax_id}</span></div>
                        <div>โทรศัพท์: <span className="font-medium">{props.company.tel}</span></div>
                        <div>อีเมล: <span className="font-medium">{props.company.email}</span></div>
                    </Stack>
                </Group>
                <Group>
                    <Stack gap={0} align="flex-end">
                        <div className="text-4xl font-bold">ใบแจ้งหนี้</div>
                        <div className="text-xl font-bold">{project.name}</div>
                        <div>{[project.address.address, project.address.subdistrict, project.address.district, project.address.province, project.address.postal_code].filter(Boolean).join(', ')}</div>
                        <div><span className="font-medium">{invoice.invoice_id}</span></div>
                    </Stack>
                </Group>
            </Group>
            <Group justify="space-between" mt={10}>
                <Group>
                    <Stack gap={0}>
                        <div className="text-xl font-bold text-zinc-400">ลูกค้า</div>
                        <div className="text-xl font-bold">{props.project.client.name}</div>
                        <div>{[props.project.client.address.address, props.project.client.address.subdistrict, props.project.client.address.district, props.project.client.address.province, props.project.client.address.postal_code].filter(Boolean).join(', ')}</div>
                        <div>โทรศัพท์: <span className="font-medium">{props.project.client.tel}</span></div>
                        <div>อีเมล: <span className="font-medium">{props.project.client.email}</span></div>
                    </Stack>
                </Group>
                <Group>
                    <div className="grid grid-cols-2 gap-x-2 ">
                        <div className="text-end">งวดงาน:</div>
                        <div className="font-medium text-end">{String(invoice.period.period_number).padStart(3, '0')}</div>

                        <div className="text-end">วันที่:</div>
                        <div className="font-medium text-end">{dayjs(parseISO(invoice.invoice_date)).format("DD/MM/BBBB")}</div>

                        <div className="text-end">วันครบกําหนด:</div>
                        <div className="font-medium text-end">{dayjs(parseISO(invoice.payment_due_date)).format("DD/MM/BBBB")}</div>

                        <div className="text-end">วันที่รับเงิน:</div>
                        <div className="font-medium text-end">{dayjs(parseISO(invoice.paid_date)).format("DD/MM/BBBB")}</div>
                    </div>
                </Group>
            </Group>
            <Table withTableBorder withColumnBorders withRowBorders mt={15}>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={200}>
                            <div className="text-center">รายการ</div>
                        </Table.Th>
                        <Table.Th colSpan={2} >คำอธิบายรายการเพิ่มเติม</Table.Th>
                        <Table.Th w={200} align="center">
                            <div className="text-center">จำนวนเงิน</div>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Td>งวดงาน</Table.Td>
                        <Table.Td colSpan={2}>งวดที่ {invoice.period.period_number}</Table.Td>
                        <Table.Td align="right"><NumberFormatter value={Number(invoice.period.amount_period ?? 0).toFixed(2)} thousandSeparator decimalScale={2} /></Table.Td>
                    </Table.Tr>
                    {/* <Table.Tr>
                        <Table.Td>ค่าดำเนินงานและกำไร</Table.Td>
                        <Table.Td colSpan={2}></Table.Td>
                        <Table.Td align="right"><NumberFormatter value={Number(0).toFixed(2)} thousandSeparator decimalScale={2} /></Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td>หักเงินมัดจำ</Table.Td>
                        <Table.Td colSpan={2}></Table.Td>
                        <Table.Td align="right"><NumberFormatter value={Number(0).toFixed(2)} thousandSeparator decimalScale={2} /></Table.Td>
                    </Table.Tr> */}
                    <Table.Tr>
                        <Table.Td>หักเงินประกันผลงาน</Table.Td>
                        <Table.Td colSpan={2}></Table.Td>
                        <Table.Td align="right"><NumberFormatter value={Number(invoice.retention).toFixed(2)} thousandSeparator decimalScale={2} /></Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                        <Table.Td align="right" colSpan={3}>
                            <div>จำนวนเงินรวมทั้งสิ้น</div>
                        </Table.Td>
                        <Table.Td align="right"><NumberFormatter value={Number(invoice.period.amount_period - invoice.retention).toFixed(2)} thousandSeparator decimalScale={2} /></Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
            <Group gap={3} mt={10}>
                <div className="font-bold">เงื่อนไขการชำระเงิน:</div>
                <div>{invoice.payment_term}</div>
            </Group>
            <Group gap={3} mt={10}>
                <div className="font-bold">หมายเหตุ:</div>
                <div>{invoice.remarks}</div>
            </Group>
            {props.isPrintMode && <Group justify="end" mt={20}>
                <Group gap={50}>
                    <Stack align="center" gap={2}>
                        <div>..............................................</div>
                        <div>(..............................................)</div>
                        <div>ผู้รับวางบิล</div>
                        <div>{dayjs().format("DD/MM/BBBB")}</div>
                    </Stack>
                    <Stack align="center" gap={2}>
                        <div>..............................................</div>
                        <div>{props.company.name}</div>
                        <div>ผู้วางบิล</div>
                        <div>{dayjs().format("DD/MM/BBBB")}</div>
                    </Stack>
                </Group>
            </Group>}

        </div>
    )
}