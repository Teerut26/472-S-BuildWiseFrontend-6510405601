import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export type DeleteJobBoqProps = {
  boq_id: string;
  job_id: string;
};

const deleteJobBoq = async (props?: DeleteJobBoqProps) => {
  try {
    const res = await axiosAPI.delete<BaseResponse<object>>(
      `/boqs/${props?.boq_id}/jobs/${props?.job_id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default deleteJobBoq;
