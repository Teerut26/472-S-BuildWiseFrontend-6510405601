import editInvoice from "@/services/invoice/editInvoice.service";
import { useMutation } from "@tanstack/react-query";

const useEditInvoice = () => {
  return useMutation({
    mutationFn: editInvoice,
  });
};

export default useEditInvoice;
