import useGetBoqFromProject from "@/hooks/queries/boq/useGetBoqFromProject";
import useGetCompanyByUser from "@/hooks/queries/company/useGetCompanyByUser";
import useGetOverviewProject from "@/hooks/queries/project/useGetOverviewProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import useGetSummaryProject from "@/hooks/queries/project/useGetSummaryProject";
import useGetExportQuotationByProject from "@/hooks/queries/quotation/useGetExportQuotationByProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import {
  Badge,
  Card,
  Divider,
  NumberFormatter,
  Table,
  Text,
} from "@mantine/core";
import {
  IconMail,
  IconPhone,
  IconPhoneCall,
  IconRecordMail,
} from "@tabler/icons-react";
import { format, addMonths } from "date-fns";
import { DataTable } from "mantine-datatable";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";

export default function Quotation(
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
    <div className="relative flex flex-col text-[14px]">
      <div className="flex flex-col gap-3">
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
        <Card p={0} withBorder>
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
              },
              {
                accessor: "unit",
                title: "หน่วยงานของงาน",
              },
              {
                accessor: "overall_cost",
                title: "ต้นทุนประเมินต่อหน่วย",
              },
              {
                accessor: "selling_price",
                title: "ราคาขายต่อหน่วย",
              },
              {
                accessor: "estimated_profit",
                title: "กำไรประเมินต่อหน่วย",
              },
              {
                accessor: "actual_overall_cost",
                title: "ต้นทุนจริงต่อหน่วย",
              },
              {
                accessor: "actual_profit",
                title: "กำไรจริงต่อหน่วย",
              },
              {
                accessor: "actual_profit",
                title: "กำไรจริงรวม",
                render: (value) => {
                  return <div>{value.actual_profit * value.quantity}</div>;
                },
              },
            ]}
          />
        </Card>
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
