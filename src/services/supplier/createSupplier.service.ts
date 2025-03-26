import { type AddressSchemaType } from "@/schemas/address.schema";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export interface Data {
  id: string;
  name: string;
  email: string;
  tel: string;
  address: AddressSchemaType;
}

export type CreateSupplierProps = {
  name: string;
  email: string;
  tel: string;
  address: AddressSchemaType;
};

const createSupplier = async (props?: CreateSupplierProps) => {
  try {
    const res = await axiosAPI.post<BaseResponse<Data>>("/suppliers", props);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default createSupplier;
