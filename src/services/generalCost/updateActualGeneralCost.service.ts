import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type UpdateActualGeneralCostProps = {
  g_id: string;
  actual_cost: number;
};

const updateActualGeneralCost = async (props: UpdateActualGeneralCostProps) => {
  try {
    const data = _.omit(props, ["g_id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      `/general-costs/${props?.g_id}/actual-cost`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateActualGeneralCost;
