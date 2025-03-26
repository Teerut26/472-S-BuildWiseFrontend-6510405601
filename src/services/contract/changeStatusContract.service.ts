/* eslint-disable @typescript-eslint/no-unsafe-return */
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type ChangeStatusContractProps = {
    project_id: string;
};

const changeStatusContract = async (props: ChangeStatusContractProps) => {
  try {
    const data = props;
    const res = await axiosAPI.put(
      `/contracts/${props?.project_id}/status`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default changeStatusContract;
