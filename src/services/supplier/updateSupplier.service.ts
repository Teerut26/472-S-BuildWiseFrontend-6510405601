import { AddressSchemaType } from "@/schemas/address.schema";
import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type UpdateSupplierProps = {
  id: string;
  name: string;
  email: string;
  tel: string;
  address: AddressSchemaType;
};

const updateSupplier = async (props?: UpdateSupplierProps) => {
  try {
    const data = _.omit(props, ["id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      "/suppliers/" + props?.id,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateSupplier;
