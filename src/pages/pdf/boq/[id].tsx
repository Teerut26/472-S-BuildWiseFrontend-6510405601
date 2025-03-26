import useGetBoqFromProject from "@/hooks/queries/boq/useGetBoqFromProject";
import useGetExportBoqFromProject from "@/hooks/queries/boq/useGetExportBoqFromProject";
import { NumberFormatter, Text } from "@mantine/core";
import { format } from "date-fns";
import _ from "lodash";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";

export default function BoqReport(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const getExportBoqFromProject = useGetExportBoqFromProject({
    project_id: props.id ?? "",
  });

  const getBoqFromProject = useGetBoqFromProject({
    project_id: props.id ?? "",
  });

  const totalGeneralCost = _.sumBy(
    getExportBoqFromProject.data?.data.general_costs,
    (o) => o.estimated_cost,
  );

  return (
    <div className="relative flex flex-col text-[14px]">
      <div>
        {/* Header */}
        <div className="flex justify-between">
          <div className="px-2 py-1">
            <h1 className="text-xl font-bold">รายการประมาณราคา</h1>
            <h2 className="text-lg">(BILL OF QUANTITY)</h2>
          </div>
          <div className="px-2 py-1 text-right">
            <div>
              <span className="font-semibold">Issued Date:</span>{" "}
              {format(new Date(), "dd-MMM-yyyy")}
            </div>
            <div>{props.id}</div>
          </div>
        </div>
        {/* Project Info */}
        <div className="grid grid-cols-2 border-b p-4">
          <div>
            <p>
              <span className="font-semibold">โครงการ :</span>{" "}
              {getExportBoqFromProject.data?.data.project_info.project_name}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">สถานที่ :</span>{" "}
              {
                getExportBoqFromProject.data?.data.project_info.project_address
                  .address
              }
              ,{" "}
              {
                getExportBoqFromProject.data?.data.project_info.project_address
                  .subdistrict
              }
              ,{" "}
              {
                getExportBoqFromProject.data?.data.project_info.project_address
                  .district
              }
              ,{" "}
              {
                getExportBoqFromProject.data?.data.project_info.project_address
                  .province
              }
              ,{" "}
              {
                getExportBoqFromProject.data?.data.project_info.project_address
                  .postal_code
              }
            </p>
          </div>
        </div>
        {/* Table */}
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">
                ลำดับ
                <br />
                ITEM
              </th>
              <th className="border px-2 py-1">
                รายละเอียด
                <br />
                DESCRIPTION
              </th>
              <th className="border px-2 py-1">
                ปริมาณ
                <br />
                QTY
              </th>
              <th className="border px-2 py-1">
                หน่วย
                <br />
                UNIT
              </th>
              <th className="border px-2 py-1">
                รวมค่าวัสดุ
                <br />
                MATERIAL
              </th>
              <th className="border px-2 py-1">
                รวมค่าแรง
                <br />
                LABOUR
              </th>
              <th className="border px-2 py-1">
                รวมค่าวัสดุ+รวมค่าแรง
                <br />
                AMOUNT
              </th>
            </tr>
          </thead>
          <tbody>
            {getExportBoqFromProject.data?.data.jobs.map((job, index) => (
              <tr key={index}>
                <td className="border px-2 py-1 text-center">{index + 1}</td>
                <td className="border px-2 py-1">{job.job_name}</td>
                <td className="border px-2 py-1 text-center">
                  <NumberFormatter value={job.quantity} thousandSeparator />
                </td>
                <td className="border px-2 py-1 text-center">{job.unit}</td>
                <td className="border px-2 py-1 text-right">
                  <NumberFormatter
                    value={job.total_estimated_price.toFixed(2)}
                    thousandSeparator
                  />
                </td>
                <td className="border px-2 py-1 text-right">
                  <NumberFormatter
                    value={job.total_labor_cost.toFixed(2)}
                    thousandSeparator
                  />
                </td>
                <td className="border px-2 py-1 text-right">
                  <NumberFormatter
                    value={(
                      job.total_labor_cost + job.total_estimated_price
                    ).toFixed(2)}
                    thousandSeparator
                  />
                </td>
              </tr>
            ))}
            {getExportBoqFromProject.data?.data.general_costs.map(
              (general_cost, index) => {
                const old_index =
                  getExportBoqFromProject.data?.data.jobs.length;
                return (
                  <tr key={index}>
                    <td className="border px-2 py-1 text-center">
                      {index + 1 + old_index}
                    </td>
                    <td className="border px-2 py-1">
                      {general_cost.type_name}
                    </td>
                    <td className="border px-2 py-1 text-center"></td>
                    <td className="border px-2 py-1 text-center"></td>
                    <td className="border px-2 py-1 text-right"></td>
                    <td className="border px-2 py-1 text-right"></td>
                    <td className="border px-2 py-1 text-right">
                      <NumberFormatter
                        value={general_cost.estimated_cost.toFixed(2)}
                        thousandSeparator
                      />
                    </td>
                  </tr>
                );
              },
            )}
            <tr className="font-semibold">
              <td className="border px-2 py-1 text-right" colSpan={4}>
                รวมค่าวัสดุและค่าแรง
              </td>
              <td className="border px-2 py-1 text-right">
                <NumberFormatter
                  value={(
                    getExportBoqFromProject.data?.data.summary_metrics
                      .total_estimated_price ?? 0
                  ).toFixed(2)}
                  thousandSeparator
                />
              </td>
              <td className="border px-2 py-1 text-right">
                <NumberFormatter
                  value={(
                    getExportBoqFromProject.data?.data.summary_metrics
                      .total_labor_cost ?? 0
                  ).toFixed(2)}
                  thousandSeparator
                />
              </td>
              <td className="border px-2 py-1 text-right text-red-600">
                <NumberFormatter
                  value={(
                    (getExportBoqFromProject.data?.data.summary_metrics
                      .total_amount ?? 0) + totalGeneralCost
                  ).toFixed(2)}
                  thousandSeparator
                />
              </td>
            </tr>

            <tr className="font-bold">
              <td className="border px-2 py-1 text-right" colSpan={6}>
                รวมเป็นเงินทั้งสิ้น
              </td>
              <td className="border px-2 py-1 text-right text-red-600">
                {/* <NumberFormatter
                  value={(
                    getExportBoqFromProject.data?.data.summary_metrics
                      .grand_total ?? 0
                  ).toFixed(2)}
                  thousandSeparator
                /> */}
                <NumberFormatter
                  value={(
                    (getExportBoqFromProject.data?.data.summary_metrics
                      .total_amount ?? 0) + totalGeneralCost
                  ).toFixed(2)}
                  thousandSeparator
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {getExportBoqFromProject.data?.data.jobs.map((job, index) => (
        <div key={index} className="page-break relative mt-5 flex flex-col">
          <Text fw={700} my={3}>
            {index + 1}. {job.job_name}
          </Text>
          <table className="w-full" key={index}>
            <thead className="bg-gray-100">
              <tr>
                <th className="border" rowSpan={2}>
                  รายการ
                </th>
                <th className="border text-center" colSpan={2}>
                  ปริมาณวัสดุ
                </th>
                <th className="border text-center" colSpan={2}>
                  ค่าวัสดุ
                </th>
              </tr>
              <tr>
                <th className="border">จำนวนรวม</th>
                <th className="border">หน่วย</th>
                <th className="border">ต่อหน่วย</th>
                <th className="border">รวม</th>
              </tr>
            </thead>
            <tbody>
              {job.materials.map((material, index) => (
                <tr key={index}>
                  <td className="border px-2 py-1">{material.material_name}</td>
                  <td className="border px-2 py-1 text-right">
                    <NumberFormatter
                      value={material.quantity.toFixed(2)}
                      thousandSeparator
                    />
                  </td>
                  <td className="border px-2 py-1">{material.unit}</td>
                  <td className="border px-2 py-1 text-right">
                    <NumberFormatter
                      value={material.estimated_price.toFixed(2)}
                      thousandSeparator
                    />
                  </td>
                  <td className="border px-2 py-1 text-right">
                    <NumberFormatter
                      value={material.total.toFixed(2)}
                      thousandSeparator
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      id: context.query.id?.toString(),
      user_id: context.query.user_id?.toString(),
    },
  };
}
