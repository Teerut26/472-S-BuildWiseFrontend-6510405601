import { type AddressSchemaType } from "@/schemas/address.schema";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

interface Data {
  company_id: string;
  name: string;
  email: string;
  tel: string;
  address: AddressSchemaType;
  tax_id: string;
  is_new: boolean;
}

export type GetCompanyByUserResponse = Data;

export type GetCompanyByUserProps = {
  user_id: string;
};

const getCompanyByUser = async (props: GetCompanyByUserProps) => {
  try {
    const res = await axiosAPI.get<BaseResponse<Data>>(
      `/company/${props.user_id}`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default getCompanyByUser;
