import { AddressSchemaType } from "@/schemas/address.schema";
import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export interface Data {
  id: string;
  name: string;
  email: string;
  tel: string;
  address: AddressSchemaType;
  tax_id: string;
  created_at: string;
  updated_at: string;
}

export type GetClientProps = {
  client_id: string;
};

const getClient = async (props: GetClientProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(
      "/clients/" + props?.client_id,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getClient;
