import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export interface Data {
  job_id: string;
  name: string;
  description: string;
  unit: string;
}

export type CreateJobProps = {
  name: string;
  description: string;
  unit: string;
};

const createJob = async (props?: CreateJobProps) => {
  try {
    const res = await axiosAPI.post<BaseResponse<Data>>("/jobs", props);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default createJob;
