import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type UpdateMaterialEstimateProps = {
  boq_id: string;
  material_id: string;
  estimated_price: number;
};

const updateMaterialEstimateProject = async (
  props: UpdateMaterialEstimateProps,
) => {
  try {
    const data = _.omit(props, ["boq_id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      `/materials/${props.boq_id}/estimated-price`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateMaterialEstimateProject;
