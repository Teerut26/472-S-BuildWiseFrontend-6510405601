import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export type DeleteMaterialProps = {
  material_id: string;
};

const deleteMaterial = async (props?: DeleteMaterialProps) => {
  try {
    const res = await axiosAPI.delete<BaseResponse<object>>(
      "/materials/" + props?.material_id,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default deleteMaterial;
