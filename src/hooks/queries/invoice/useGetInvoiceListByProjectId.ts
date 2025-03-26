import getInvoice, {
  type GetInvoiceProps,
} from "@/services/invoice/getInvoice.service";
import getInvoiceListByProjectId, {
  type GetInvoiceListByProjectIdProps,
} from "@/services/invoice/getInvoiceListByProjectId.service";
import { useQuery } from "@tanstack/react-query";

const useGetInvoiceListByProjectId = (
  props: GetInvoiceListByProjectIdProps,
) => {
  return useQuery({
    queryKey: ["useGetInvoiceListByProjectId", props.project_id],
    queryFn: () => getInvoiceListByProjectId(props),
    enabled: !!props.project_id,
  });
};

export default useGetInvoiceListByProjectId;
