import { type AddressSchemaType } from "@/schemas/address.schema";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type UpdateCompanyByUserProps = {
  user_id: string;
  name: string;
  email: string;
  tel: string;
  address: AddressSchemaType;
  tax_id: string;
};

const updateCompanyByUser = async (props: UpdateCompanyByUserProps) => {
  try {
    const data = _.omit(props, ["user_id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      `/company/${props.user_id}`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateCompanyByUser;
