import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type UpdateJobBoqProps = {
  boq_id: string;
  job_id: string;
  quantity: number;
  labor_cost: number;
};

const updateJobBoq = async (props?: UpdateJobBoqProps) => {
  try {
    const data = _.omit(props, ["boq_id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      "/boqs/" + props?.boq_id + "/jobs",
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateJobBoq;
