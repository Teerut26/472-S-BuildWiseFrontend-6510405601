import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Data {
  quotation_id: string;
  status: string;
  valid_date: string;
  tax_percentage: number;
  selling_general_cost: number;
  jobs: Job[];
  general_costs: Generalcost[];
}

interface Generalcost {
  type_name: string;
  estimated_cost: number;
}

interface Job {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  labor_cost: number;
  selling_price: number;
  total_material_price: number;
  total: number;
  overall_cost: number;
  total_selling_price: number;
}

export type GetQuotationByProjectProps = {
  project_id: string;
};

const getQuotationByProject = async (props: GetQuotationByProjectProps) => {
  try {
    const res = await axiosAPI.post<BaseResponse<Data>>(
      `/quotations/projects/${props.project_id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getQuotationByProject;
