import { type AddressSchemaType } from "@/schemas/address.schema";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Data {
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

export type GetOverviewProjectProps = {
  id: string;
};

const getOverviewProject = async (props?: GetOverviewProjectProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(`/projects/${props?.id}/overview`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getOverviewProject;
