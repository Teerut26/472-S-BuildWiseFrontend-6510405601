import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export type DeleteJobProps = {
  job_id: string;
};

const deleteJob = async (props?: DeleteJobProps) => {
  try {
    const res = await axiosAPI.delete<BaseResponse<object>>(
      `/jobs/${props?.job_id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default deleteJob;
