import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type UpdateMaterialJobProps = {
  job_id: string;
  material_id: string;
  quantity: number;
};

const updateMaterialJob = async (props?: UpdateMaterialJobProps) => {
  try {
    const data = _.omit(props, ["job_id", "material_id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      "/jobs/" +
        props?.job_id +
        "/materials/" +
        props?.material_id +
        "/quantity",
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateMaterialJob;
