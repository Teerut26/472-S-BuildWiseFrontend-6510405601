import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export interface DeleteProjectResponse {
  message: string;
}

export type DeleteProjectProps = {
  project_id: string;
};

const deleteProject = async (props?: DeleteProjectProps) => {
  try {
    const res = await axiosAPI.delete<BaseResponse<object>>(
      "/projects/" + props?.project_id,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default deleteProject;
