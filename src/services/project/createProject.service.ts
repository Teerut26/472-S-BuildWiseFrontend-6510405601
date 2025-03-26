import { type AddressSchemaType } from "@/schemas/address.schema";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export interface Data {
  id: string;
  name: string;
  description: string;
  address: AddressSchemaType;
  status: string;
  client_id: string;
  client: Client;
  created_at: string;
  updated_at: string;
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

export type CreateProjectProps = {
  name: string;
  description: string;
  address: AddressSchemaType;
  client_id: string;
};

const createProject = async (props?: CreateProjectProps) => {
  try {
    const res = await axiosAPI.post<BaseResponse<Data>>("/projects", props);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default createProject;
