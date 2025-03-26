import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Data {
  project_id: string;
  project_name: string;
  overview: Overview;
  jobs: Job[];
  total_stats: Totalstats;
}

interface Totalstats {
  total_estimated_cost: number;
  total_actual_cost: number;
  total_selling_price: number;
  total_estimated_profit: number;
  total_actual_profit: number;
  estimated_margin_percentage: number;
  actual_margin_percentage: number;
  cost_variance: number;
  cost_variance_percentage: number;
}

interface Job {
  job_name: string;
  unit: string;
  quantity: number;
  valid_date: string;
  labor_cost: number;
  material_cost: number;
  overall_cost: number;
  selling_price: number;
  estimated_profit: number;
  estimated_margin_percentage: number;
  actual_overall_cost: number;
  actual_profit: number;
  actual_margin_percentage: number;
  total_profit: number;
  quotation_status: string;
  tax_percentage: number;
}

interface Overview {
  quotation_id: string;
  boq_id: string;
  total_overall_cost: number;
  total_selling_price: number;
  total_actual_cost: number;
  tax_amount: number;
  total_with_tax: number;
  estimated_profit: number;
  estimated_margin_percentage: number;
  actual_profit: number;
  actual_margin_percentage: number;
}

export type GetSummaryProjectProps = {
  id: string;
};

const getSummaryProject = async (props?: GetSummaryProjectProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(`/projects/${props?.id}/summary`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getSummaryProject;
