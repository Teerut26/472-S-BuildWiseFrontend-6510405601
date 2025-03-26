import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export interface Data {
  materials: Material[];
}

export interface Material {
  material_id: string;
  name: string;
  unit: string;
}

export type GetMaterialsProps = {};

const getMaterials = async (props?: GetMaterialsProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>("/materials");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getMaterials;
