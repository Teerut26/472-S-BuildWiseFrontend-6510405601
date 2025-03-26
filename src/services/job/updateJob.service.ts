import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type UpdateJobProps = {
  id?: string;
  name: string;
  description: string;
  unit: string;
};

const updateJob = async (props?: UpdateJobProps) => {
  try {
    const data = _.omit(props, ["id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      "/jobs/" + props?.id,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateJob;
