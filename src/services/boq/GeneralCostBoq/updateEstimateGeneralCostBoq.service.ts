import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type UpdateEstimateGeneralCostBoqProps = {
  g_id: string;
  estimated_cost: number;
};

const updateEstimateGeneralCostBoq = async (
  props: UpdateEstimateGeneralCostBoqProps,
) => {
  try {
    const data = _.omit(props, ["g_id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      `/general-costs/${props?.g_id}`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateEstimateGeneralCostBoq;
