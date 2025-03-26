import { AddressSchemaType } from "@/schemas/address.schema";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Data {
  project_info: Projectinfo;
  general_costs: Generalcost[];
  jobs: Job[];
  summary_metrics: Summarymetrics;
}

interface Summarymetrics {
  total_general_cost: number;
  total_material_cost: number;
  total_labor_cost: number;
  total_estimated_price: number;
  total_amount: number;
  grand_total: number;
}

interface Job {
  job_id: string;
  job_name: string;
  description: string;
  quantity: number;
  unit: string;
  labor_cost: number;
  estimated_price: number;
  total_estimated_price: number;
  total_labor_cost: number;
  total: number;
  materials: Material[];
}

interface Material {
  job_id: string;
  job_name: string;
  material_name: string;
  quantity: number;
  unit: string;
  estimated_price: number;
  total: number;
}

interface Generalcost {
  type_name: string;
  estimated_cost: number;
}

interface Projectinfo {
  project_name: string;
  project_address: AddressSchemaType;
}

export type GetExportBoqFromProjectProps = {
  project_id: string;
};

const getExportBoqFromProject = async (props: GetExportBoqFromProjectProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(
      `/boqs/project/${props?.project_id}/export`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getExportBoqFromProject;
