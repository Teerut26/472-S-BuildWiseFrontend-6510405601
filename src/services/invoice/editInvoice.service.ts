import { type BaseResponse } from "@/types/BaseResponse.type";
import { axiosAPI } from "@/utils/axios";
import _ from "lodash";

export type EditInvoiceProps = {
  invoice_id: string;
  invoice_date: string;
  payment_due_date: string;
  paid_date: string;
  payment_term: string;
  remarks: string;
};

const editInvoice = async (props: EditInvoiceProps) => {
  try {
    const data = _.omit(props, ["invoice_id"]);
    const res = await axiosAPI.put<BaseResponse<object>>(
      `/invoice/${props.invoice_id}`,
      data,
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default editInvoice;
