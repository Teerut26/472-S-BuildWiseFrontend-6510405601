import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
export interface Data {
  material_id: string;
  name: string;
  unit: string;
}

export type CreateMaterialProps = {
  name: string;
  unit: string;
};

const createMaterial = async (props?: CreateMaterialProps) => {
  try {
    const res = await axiosAPI.post<BaseResponse<Data>>("/materials", props);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default createMaterial;
