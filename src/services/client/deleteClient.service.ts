import { BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import { AxiosError } from "axios";

export type DeleteClientProps = {
  client_id: string;
};

const deleteClient = async (props?: DeleteClientProps) => {
  try {
    const res = await axiosAPI.delete<BaseResponse<object>>(
      "/clients/" + props?.client_id,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default deleteClient;
