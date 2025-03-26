import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export type ApproveBoqProps = {
  boq_id: string;
};

const approveBoq = async (props?: ApproveBoqProps) => {
  try {
    const res = await axiosAPI.post<BaseResponse<object>>(
      "/boqs/" + props?.boq_id + "/approve",
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default approveBoq;
