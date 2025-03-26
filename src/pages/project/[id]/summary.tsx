import BackButton from "@/components/BackButton/BackButton";
import useGetProject from "@/hooks/queries/project/useGetProject";
import { Button, Card, NumberFormatter, Text } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import {
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType,
} from "next";
import { BarChart } from "@mantine/charts";
import { FieldLabel } from "@/components/FieldLabel/FieldLabel";
import useGetBoqFromProject from "@/hooks/queries/boq/useGetBoqFromProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import useGetOverviewProject from "@/hooks/queries/project/useGetOverviewProject";
import useGetSummaryProject from "@/hooks/queries/project/useGetSummaryProject";
import { DataTable } from "mantine-datatable";
import Link from "next/link";

export default function Summary(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
    const getProject = useGetProject({ id: props.id! });
    const getBoqFromProject = useGetBoqFromProject({
        project_id: props.id ?? "",
    });
    const getQuoTationByProject = useGetQuotationByProject({
        project_id: props.id ?? "",
    });
    const getOverviewProject = useGetOverviewProject({ id: props.id ?? "" });
    const getSummaryProject = useGetSummaryProject({ id: props.id ?? "" });

    return (
        <div className="flex flex-col">
            <BackButton label="ย้อนกลับไปหน้ารายละเอียดโครงการ" />
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <div className="text-xl font-bold">
                        <div className="flex items-center gap-2">สรุป</div>
                    </div>
                    <Text size="md" fw={700}>
                        {getProject.data?.data.name}
                    </Text>
                </div>
                <div className="flex items-center gap-2">
                    <a href={`/api/report/summary/${props.id}`} target="_blank">
                        <Button variant="default" leftSection={<IconFileText size={15} />}>
                            Export
                        </Button>
                    </a>
                </div>
            </div>
            <div className="mt-3 flex flex-col gap-3">
                <Card withBorder>
                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <Text size="xl" fw={700}>
                                {getSummaryProject.data?.data.project_name}
                            </Text>
                            <Text size="md">{getProject.data?.data.description}</Text>
                            <Text size="sm" mt={5}>
                                {getProject.data?.data.address.address},{" "}
                                {getProject.data?.data.address.subdistrict},{" "}
                                {getProject.data?.data.address.district},{" "}
                                {getProject.data?.data.address.province},{" "}
                                {getProject.data?.data.address.postal_code}
                            </Text>
                        </div>
                    </div>
                </Card>
                <div className="flex justify-between gap-3">
                    <Card withBorder className="w-full">
                        <div className="flex flex-col justify-between">
                            <Text size="sm">ต้นทุนประเมินรวม</Text>
                            <Text size="xl">
                                <NumberFormatter
                                    value={getOverviewProject.data?.data.total_overall_cost?.toFixed(
                                        2,
                                    )}
                                    thousandSeparator
                                />
                            </Text>
                        </div>
                    </Card>
                    <Card withBorder className="w-full">
                        <div className="flex flex-col justify-between">
                            <Text size="md">ราคาขาย</Text>
                            <Text size="xl">
                                <NumberFormatter
                                    value={getOverviewProject.data?.data.total_selling_price?.toFixed(
                                        2,
                                    )}
                                    thousandSeparator
                                />
                            </Text>
                        </div>
                    </Card>
                    <Card withBorder className="w-full">
                        <div className="flex flex-col justify-between">
                            <Text size="md">ราคาขายรวมภาษี</Text>
                            <Text size="xl">
                                <NumberFormatter
                                    value={getOverviewProject.data?.data.total_with_tax?.toFixed(
                                        2,
                                    )}
                                    thousandSeparator
                                />
                            </Text>
                        </div>
                    </Card>
                    <Card withBorder className="w-full">
                        <div className="flex flex-col justify-between">
                            <Text size="md">กำไรประเมิน</Text>
                            <Text size="xl">
                                <NumberFormatter
                                    value={getOverviewProject.data?.data.estimated_profit?.toFixed(
                                        2,
                                    )}
                                    thousandSeparator
                                />
                            </Text>
                        </div>
                    </Card>
                    <Card withBorder className="w-full">
                        <div className="flex flex-col justify-between">
                            <Text size="md">ต้นทุนจริงรวม</Text>
                            <Text size="xl">
                                <NumberFormatter
                                    value={getOverviewProject.data?.data.total_actual_cost?.toFixed(
                                        2,
                                    )}
                                    thousandSeparator
                                />
                            </Text>
                        </div>
                    </Card>
                    <Card withBorder className="w-full">
                        <div className="flex flex-col justify-between">
                            <Text size="md">กำไรจริง</Text>
                            <Text size="xl">
                                <NumberFormatter
                                    value={getOverviewProject.data?.data.actual_profit?.toFixed(
                                        2,
                                    )}
                                    thousandSeparator
                                />
                            </Text>
                        </div>
                    </Card>
                </div>
                <Card withBorder>
                    <DataTable
                        records={getSummaryProject.data?.data.jobs}
                        columns={[
                            {
                                accessor: "job_name",
                                title: "ชื่องาน",
                            },
                            {
                                accessor: "quantity",
                                title: "จำนวนของงาน",
                                render: (data) => (<NumberFormatter value={data.quantity.toFixed(2)} thousandSeparator={true} />),
                            },
                            {
                                accessor: "unit",
                                title: "หน่วยงานของงาน",
                            },
                            {
                                accessor: "overall_cost",
                                title: "ต้นทุนประเมินต่อหน่วย",
                                render: (data) => (<NumberFormatter value={data.overall_cost.toFixed(2)} thousandSeparator={true} />)
                            },
                            {
                                accessor: "selling_price",
                                title: "ราคาขายต่อหน่วย",
                                render: (data) => (<NumberFormatter value={data.selling_price.toFixed(2)} thousandSeparator={true} />)
                            },
                            {
                                accessor: "estimated_profit",
                                title: "กำไรประเมินต่อหน่วย",
                                render: (data) => (<NumberFormatter value={data.estimated_profit.toFixed(2)} thousandSeparator={true} />)
                            },
                            {
                                accessor: "actual_overall_cost",
                                title: "ต้นทุนจริงต่อหน่วย",
                                render: (data) => (<NumberFormatter value={data.actual_overall_cost.toFixed(2)} thousandSeparator={true} />)
                            },
                            {
                                accessor: "actual_profit",
                                title: "กำไรจริงต่อหน่วย",
                                render: (data) => (<NumberFormatter value={data.actual_profit.toFixed(2)} thousandSeparator={true} />)
                            },
                            {
                                accessor: "actual_profit",
                                title: "กำไรจริงรวม",
                                // render: (value) => {
                                //     return <div>{value.actual_profit * value.quantity}</div>;
                                // },
                                render: (data) => (<NumberFormatter value={(data.actual_profit * data.quantity).toFixed(2)} thousandSeparator={true} />)
                            },
                        ]}
                    />
                </Card>
                {/* <BarChart
          h={300}
          data={[
            { month: "January", Smartphones: 1200 },
            { month: "February", Smartphones: 1900 },
            { month: "March", Smartphones: 400 },
            { month: "April", Smartphones: 1000 },
            { month: "May", Smartphones: 800 },
            { month: "June", Smartphones: 750 },
          ]}
          dataKey="month"
          series={[{ name: "Smartphones", color: "violet.6" }]}
          tickLine="y"
          gridAxis="xy"
        /> */}
                {/* <Card withBorder>
          <div className="flex flex-col">
            <Text fw={700}>เปรียบเทียบต้นทุนและกำไร</Text>
            <BarChart
              h={300}
              data={[]}
              dataKey="job_name"
              withLegend
              tickLine="xy"
              gridAxis="xy"
              series={[
                { name: "overall_cost", color: "violet.6", label: "ต้นทุนรวม" },
                {
                  name: "actual_overall_cost",
                  color: "blue.5",
                  label: "ต้นทุนจริง",
                },
                {
                  name: "actual_profit",
                  color: "red.5",
                  label: "กำไรจริง",
                },
              ]}
            />
          </div>
        </Card> */}
                {/* <Card withBorder>
          <div className="flex flex-col">
            <Text fw={700}>เปรียบเทียบต้นทุนและกำไร</Text>
            <BarChart
              h={300}
              data={getSummaryProject.data?.data.jobs ?? []}
              dataKey="job_name"
              withLegend
              tickLine="xy"
              gridAxis="xy"
              series={[
                { name: "overall_cost", color: "violet.6", label: "ต้นทุนรวม" },
                {
                  name: "actual_overall_cost",
                  color: "blue.5",
                  label: "ต้นทุนจริง",
                },
                {
                  name: "actual_profit",
                  color: "red.5",
                  label: "กำไรจริง",
                },
              ]}
            />
          </div>
        </Card> */}
            </div>
        </div>
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            id: context.query.id?.toString(),
        },
    };
}
