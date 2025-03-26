import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type UpdateSellingPriceQuotationByProjectProps = {
  project_id: string;
  tax_percentage: number;
  selling_general_cost: number;
  job_selling_prices: Jobsellingprice[];
};

interface Jobsellingprice {
  job_id: string;
  selling_price: number;
}

const updateSellingPriceQuotationByProject = async (
  props: UpdateSellingPriceQuotationByProjectProps,
) => {
  try {
    const data = _.omit(props, ["project_id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      `/quotations/projects/${props.project_id}/selling-price`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateSellingPriceQuotationByProject;
