import getSupplier, {
  GetSupplierProps,
} from "@/services/supplier/getSupplier.service";
import { useQuery } from "@tanstack/react-query";

const useGetSupplier = (props: GetSupplierProps) => {
  return useQuery({
    queryKey: ["GetSupplier", props.supplier_id],
    queryFn: () => getSupplier(props),
  });
};

export default useGetSupplier;
