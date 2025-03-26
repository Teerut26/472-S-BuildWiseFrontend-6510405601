import { type AddressSchemaType } from "@/schemas/address.schema";
import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export interface Data {
  id: string;
  name: string;
  email: string;
  tel: string;
  address: AddressSchemaType;
}
export type GetSupplierProps = {
  supplier_id: string;
};

const getSupplier = async (props: GetSupplierProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(
      "/suppliers/" + props?.supplier_id,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getSupplier;
