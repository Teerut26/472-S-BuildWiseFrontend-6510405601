import { AddressSchemaType } from "@/schemas/address.schema";
import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export interface Data {
  clients: Client[];
  total: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  tel: string;
  address: AddressSchemaType;
  tax_id: string;
  created_at: string;
  updated_at: string;
}

export type GetClientsProps = {};

const getClients = async (props?: GetClientsProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>("/clients");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getClients;
