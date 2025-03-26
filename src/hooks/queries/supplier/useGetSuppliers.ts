import getSuppliers from "@/services/supplier/getSuppliers.service";
import { useQuery } from "@tanstack/react-query";

const useGetSuppliers = () => {
  return useQuery({
    queryKey: ["GetSuppliers"],
    queryFn: () => getSuppliers(),
  });
};

export default useGetSuppliers;
