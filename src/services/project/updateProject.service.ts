import { type AddressSchemaType } from "@/schemas/address.schema";
import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type UpdateProjectProps = {
  id?: string;
  name: string;
  description: string;
  address: AddressSchemaType;
  client_id: string;
};

const updateProject = async (props?: UpdateProjectProps) => {
  try {
    const data = _.omit(props, ["id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      "/projects/" + props?.id,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default updateProject;
