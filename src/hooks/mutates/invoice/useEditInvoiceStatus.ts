import editInvoiceStatus from "@/services/invoice/editInvoiceStatus.service";
import { useMutation } from "@tanstack/react-query";

const useEditInvoiceStatus = () => {
  return useMutation({
    mutationFn: editInvoiceStatus,
  });
};

export default useEditInvoiceStatus;
