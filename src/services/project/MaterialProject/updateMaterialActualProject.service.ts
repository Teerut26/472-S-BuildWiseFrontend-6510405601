import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type UpdateMaterialActualProps = {
  boq_id: string;
  material_id: string;
  actual_price: number;
  supplier_id: string;
};

const updateMaterialActualProject = async (
  props: UpdateMaterialActualProps,
) => {
  try {
    const data = _.omit(props, ["boq_id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      `/materials/${props.boq_id}/actual-price`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateMaterialActualProject;
