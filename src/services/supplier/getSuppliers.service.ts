import { type AddressSchemaType } from "@/schemas/address.schema";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export interface Data {
  suppliers: Supplier[];
  total: number;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  tel: string;
  address: AddressSchemaType;
}

export type GetSuppliersProps = {};

const getSuppliers = async (props?: GetSuppliersProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>("/suppliers");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getSuppliers;
