import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";

export type ApproveQuotationByProjectProps = {
  project_id: string;
};

const approveQuotationByProject = async (
  props: ApproveQuotationByProjectProps,
) => {
  try {
    const res = await axiosAPI.put<BaseResponse<object>>(
      `/quotations/projects/${props.project_id}/approve`,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default approveQuotationByProject;
