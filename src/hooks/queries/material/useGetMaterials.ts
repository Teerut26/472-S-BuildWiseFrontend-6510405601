import getMaterials from "@/services/material/getMaterials.service";
import { useQuery } from "@tanstack/react-query";

const useGetMaterials = () => {
  return useQuery({
    queryKey: ["useGetMaterials"],
    queryFn: () => getMaterials(),
  });
};

export default useGetMaterials;
