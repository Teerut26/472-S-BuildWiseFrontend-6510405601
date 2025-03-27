import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
interface Data {
  jobs: Job[];
}

export interface Job {
  job_id: string;
  name: string;
  description: string;
  unit: string;
}

export type GetJobsProps = {};

const getJobs = async (props?: GetJobsProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>("/jobs");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getJobs;
