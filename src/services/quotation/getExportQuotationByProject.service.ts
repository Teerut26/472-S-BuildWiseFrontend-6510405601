import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Data {
  project_id: string;
  project_name: string;
  description: string;
  address: Address;
  client_name: string;
  client_address: Address;
  client_email: string;
  client_tel: string;
  client_tax_id: string;
  quotation_id: string;
  valid_date: string;
  tax_percentage: number;
  status: string;
  sub_total: number;
  tax_amount: number;
  jobs: Job[];
  general_costs: number;
  final_amount: number;
  selling_general_cost: number;
}

interface Job {
  name: string;
  description: string;
  unit: string;
  quantity: number;
  selling_price: null;
  amount: null;
}

interface Address {
  address: string;
  district: string;
  province: string;
  postal_code: string;
  subdistrict: string;
}

export type GetExportQuotationByProjectProps = {
  project_id: string;
};

const getExportQuotationByProject = async (
  props: GetExportQuotationByProjectProps,
) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(
      `/quotations/projects/${props.project_id}/export`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getExportQuotationByProject;
