import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type GetInvoiceListByProjectIdProps = {
  project_id: string;
};

export interface GetInvoiceListByProjectIdResponse {
  invoice_id: string;
  project_id: string;
  period_id: string;
  invoice_date: string;
  payment_due_date: string;
  paid_date: string;
  payment_term: string;
  remarks: string;
  status: string;
  retention: number;
  created_at: string;
  updated_at: string;
  period: Period;
}

interface Period {
  period_id: string;
  period_number: number;
  amount_period: number;
  delivered_within: number;
  jobs: null;
}

const getInvoiceListByProjectId = async (
  props: GetInvoiceListByProjectIdProps,
) => {
  try {
    const res = await axiosAPI.get<BaseResponse<GetInvoiceListByProjectIdResponse[]>>(
      `/invoices/${props.project_id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getInvoiceListByProjectId;
