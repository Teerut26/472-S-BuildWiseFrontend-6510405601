import useGetCompanyByUser from "@/hooks/queries/company/useGetCompanyByUser";
import useGetExportQuotationByProject from "@/hooks/queries/quotation/useGetExportQuotationByProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import { Badge, Divider, NumberFormatter, Table } from "@mantine/core";
import {
  IconMail,
  IconPhone,
  IconPhoneCall,
  IconRecordMail,
} from "@tabler/icons-react";
import { format, addMonths } from "date-fns";
import _ from "lodash";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";

export default function Quotation(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const getExportQuotationByProject = useGetExportQuotationByProject({
    project_id: props.id ?? "",
  });

  const getCompanyByUser = useGetCompanyByUser({
    user_id: props.user_id ?? "",
  });

  const getQuotationByProject = useGetQuotationByProject({
    project_id: props.id ?? "",
  });

  const FinalPrice = () => {
    const total_selling_price = _.sumBy(
      getQuotationByProject.data?.data.jobs,
      (o) => o.total_selling_price,
    );

    const selling_general_cost =
      getQuotationByProject.data?.data.selling_general_cost ?? 0;

    const tax_percentage = getQuotationByProject.data?.data.tax_percentage ?? 0;

    const tax_amount =
      (selling_general_cost + total_selling_price) * (tax_percentage / 100);
    const total_price = selling_general_cost + total_selling_price;

    return tax_amount + total_price;
  };

  return (
    <div className="relative flex flex-col text-[14px]">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="mb-1 font-semibold">ผู้ทำใบเสนอราคา</h2>
            <p>{getCompanyByUser.data?.data.name}</p>
            <p>
              {getCompanyByUser.data?.data.address?.address},{" "}
              {getCompanyByUser.data?.data.address?.subdistrict},{" "}
              {getCompanyByUser.data?.data.address?.district},{" "}
              {getCompanyByUser.data?.data.address?.province},{" "}
              {getCompanyByUser.data?.data.address?.postal_code}
            </p>
            <div className="flex gap-5">
              <div className="flex items-center gap-1">
                <IconPhone size={15} />
                <div>{getCompanyByUser.data?.data.tel}</div>
              </div>
              <div className="flex items-center gap-1">
                <IconMail size={15} />
                <div>contact234@pattana.co.th</div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-2xl font-bold">ใบเสนอราคา</h1>
            <div>{getExportQuotationByProject.data?.data.project_name}</div>
            <div>
              <div>
                <span className="font-semibold">Issued Date:</span>{" "}
                {format(new Date(), "dd-MMM-yyyy")}
              </div>
              <div>
                <span className="font-semibold">Valid Date:</span>{" "}
                {format(addMonths(new Date(), 1), "dd-MMM-yyyy")}
              </div>
            </div>
          </div>
        </div>
        <Divider my={10} />
        {/* Customer Info */}
        <div>
          <div className="mb-8">
            <h2 className="mb-1 font-semibold">ลูกค้า</h2>
            <p>{getExportQuotationByProject.data?.data.client_name}</p>
            <p>
              {getExportQuotationByProject.data?.data.client_address.address},{" "}
              {
                getExportQuotationByProject.data?.data.client_address
                  .subdistrict
              }
              , {getExportQuotationByProject.data?.data.client_address.district}
              , {getExportQuotationByProject.data?.data.client_address.province}
              ,{" "}
              {
                getExportQuotationByProject.data?.data.client_address
                  .postal_code
              }
            </p>
            <div className="flex gap-5">
              <div className="flex items-center gap-1">
                <IconPhone size={15} />
                <div>{getExportQuotationByProject.data?.data.client_tel}</div>
              </div>
              <div className="flex items-center gap-1">
                <IconMail size={15} />
                <div>{getExportQuotationByProject.data?.data.client_email}</div>
              </div>
            </div>
          </div>
        </div>
        {/* Product Table */}
        <table className="mb-8 w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">ชื่องาน</th>
              <th className="px-4 py-2 text-center">หน่วย</th>
              <th className="px-4 py-2 text-center">จำนวน</th>
              <th className="px-4 py-2 text-right">ราคาต่อหน่วย</th>
              <th className="px-4 py-2 text-right">รวม</th>
            </tr>
          </thead>
          <tbody>
            {getExportQuotationByProject.data?.data.jobs.map((job, index) => (
              <tr key={index}>
                <td className="px-4">
                  <p className="font-semibold">{job.name}</p>
                </td>
                <td className="px-4 text-center">
                  <Badge variant="light">{job.unit}</Badge>
                </td>
                <td className="px-4 text-center">
                  <NumberFormatter
                    value={(job.quantity ?? 0).toFixed(2)}
                    thousandSeparator
                  />
                </td>
                <td className="px-4 text-right">
                  <NumberFormatter
                    value={(job.selling_price ?? 0).toFixed(2)}
                    thousandSeparator
                  />
                </td>
                <td className="px-4 text-right">
                  <NumberFormatter
                    value={(
                      (job.quantity ?? 0) * (job.selling_price ?? 0)
                    ).toFixed(2)}
                    thousandSeparator
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Divider my={10} />
        {/* Summary */}
        <div className="mb-8 flex justify-end">
          <div className="w-64">
            <div className="flex justify-between">
              <span>ราคารวมค่าใช้จ่าย</span>
              <span>
                <NumberFormatter
                  value={getExportQuotationByProject.data?.data.sub_total.toFixed(
                    2,
                  )}
                  thousandSeparator
                />
              </span>
            </div>
            <div className="flex justify-between">
              <span>
                ค่าภาษี {getExportQuotationByProject.data?.data.tax_percentage}%
              </span>
              <span>
                <NumberFormatter
                  value={getExportQuotationByProject.data?.data.tax_amount.toFixed(
                    2,
                  )}
                  thousandSeparator
                />
              </span>
            </div>
            <div className="flex justify-between font-bold">
              <span>ราคารวมภาษี</span>
              <span>
                <NumberFormatter
                  value={FinalPrice().toFixed(
                    2,
                  )}
                  thousandSeparator
                />
              </span>
            </div>
          </div>
        </div>

        {/* Signatures */}
        <div className="flex items-baseline justify-between">
          <div className="text-center">
            <div className="mx-auto mb-2 w-48 border-b border-black" />
            <p>(................................................)</p>
            <p>ผู้รับเหมา</p>
            <p className="mt-2 font-semibold">Approved By</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-2 w-48 border-b border-black" />
            <p>(................................................)</p>
            <p>ลูกค้า</p>
            <p className="mt-2 font-semibold">Accepted By</p>
          </div>
        </div>
      </div>
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
