import getInvoice, {
  type GetInvoiceProps,
} from "@/services/invoice/getInvoice.service";
import { useQuery } from "@tanstack/react-query";

const useGetInvoice = (props: GetInvoiceProps) => {
  return useQuery({
    queryKey: ["useGetInvoice", props.invoice_id],
    queryFn: () => getInvoice(props),
  });
};

export default useGetInvoice;
