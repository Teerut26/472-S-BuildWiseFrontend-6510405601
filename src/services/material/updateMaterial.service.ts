import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type UpdateMaterialProps = {
  id?: string;
  name: string;
  unit: string;
};

const updateMaterial = async (props?: UpdateMaterialProps) => {
  try {
    const data = _.omit(props, ["id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      "/materials/" + props?.id,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateMaterial;
