import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Data {
  general_costs: Generalcost[];
}

interface Generalcost {
  g_id: string;
  boq_id: string;
  type_name: string;
  actual_cost: number;
  estimated_cost: number;
}

export type GetGeneralCostBoqProps = {
  project_id: string;
};

const getGeneralCostBoq = async (props?: GetGeneralCostBoqProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(
      `/general-costs/project/${props?.project_id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getGeneralCostBoq;
