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

export type GetProjectResponse = Data;

export type GetProjectProps = {
  id: string;
};


const getProject = async (props?: GetProjectProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(
      "/projects/" + props?.id,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getProject;
