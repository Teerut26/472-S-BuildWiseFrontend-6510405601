import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Data {
  job_id: string;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  labor_cost: number;
}

export type getJobsByProjectIDProps = {
  project_id: string;
};

const getJobsByProjectID = async (props?: getJobsByProjectIDProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data[]>>(`/jobs/project/${props?.project_id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getJobsByProjectID;
