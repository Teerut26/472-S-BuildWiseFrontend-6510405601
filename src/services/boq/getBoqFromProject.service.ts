import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Data {
  id: string;
  project_id: string;
  status: string;
  selling_general_cost: number;
  jobs: Job[];
}

interface Job {
  job_id: string;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  labor_cost: number;
}

export type GetBoqFromProjectProps = {
  project_id: string;
};

const getBoqFromProject = async (props?: GetBoqFromProjectProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(
      `/boqs/project/${props?.project_id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getBoqFromProject;
