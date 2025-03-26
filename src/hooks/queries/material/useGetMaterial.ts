import getMaterial, {
  GetMaterialProps,
} from "@/services/material/getMaterial.service";
import { useQuery } from "@tanstack/react-query";

const useGetMaterial = (props: GetMaterialProps) => {
  return useQuery({
    queryKey: ["useGetMaterial", props.material_id],
    queryFn: () => getMaterial(props),
  });
};

export default useGetMaterial;
