import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type CancelProjectProps = {
  project_id: string;
};

const cancelProject = async (props: CancelProjectProps) => {
  try {
    const res = await axiosAPI.put<BaseResponse<object>>(
      `/projects/${props?.project_id}/cancel`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default cancelProject;
