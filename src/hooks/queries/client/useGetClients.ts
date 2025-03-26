import getClients from "@/services/client/getClients.service";
import { useQuery } from "@tanstack/react-query";

const useGetClients = () => {
  return useQuery({
    queryKey: ["GetSuppliers"],
    queryFn: () => getClients(),
  });
};

export default useGetClients;
