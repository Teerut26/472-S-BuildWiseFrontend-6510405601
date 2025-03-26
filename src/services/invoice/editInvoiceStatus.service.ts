import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type EditInvoiceStatusProps = {
  invoice_id: string;
  status: string;
};

const editInvoiceStatus = async (props: EditInvoiceStatusProps) => {
  try {
    const data = _.omit(props, ["invoice_id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      `/invoice/${props.invoice_id}/status`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default editInvoiceStatus;
