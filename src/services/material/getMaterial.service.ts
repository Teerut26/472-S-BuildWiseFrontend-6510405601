import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export interface Data {
  material_id: string;
  name: string;
  unit: string;
}

export type GetMaterialProps = {
  material_id: string;
};

const getMaterial = async (props: GetMaterialProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(
      "/materials/" + props?.material_id,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getMaterial;
