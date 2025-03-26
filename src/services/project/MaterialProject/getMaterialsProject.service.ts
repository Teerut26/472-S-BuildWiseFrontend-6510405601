import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Data {
  materials: Material[];
}

interface Material {
  material_id: string;
  name: string;
  total_quantity: number;
  unit: string;
  estimated_price: number;
  avg_actual_price: number;
  actual_price: number;
  supplier_id: string;
  supplier_name: string;
}

export type GetMaterialsProjectProps = {
  project_id: string;
};

const getMaterialsProjectProject = async (props: GetMaterialsProjectProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(
      `/materials/${props.project_id}/prices`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getMaterialsProjectProject;
