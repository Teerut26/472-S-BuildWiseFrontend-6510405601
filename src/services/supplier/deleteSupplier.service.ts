import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export type DeleteSupplierProps = {
  supplier_id: string;
};

const deleteSupplier = async (props?: DeleteSupplierProps) => {
  try {
    const res = await axiosAPI.delete<BaseResponse<object>>(
      "/suppliers/" + props?.supplier_id,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default deleteSupplier;
