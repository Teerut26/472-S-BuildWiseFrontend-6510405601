import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type ChangeStatusProjectProps = {
  project_id: string;
  status: string;
};

const changeStatusProject = async (props: ChangeStatusProjectProps) => {
  try {
    const data = _.omit(props, ["project_id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      `/projects/${props?.project_id}/status`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default changeStatusProject;
