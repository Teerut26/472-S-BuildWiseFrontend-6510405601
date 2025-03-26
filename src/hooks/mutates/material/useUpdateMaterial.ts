import updateMaterial from "@/services/material/updateMaterial.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateMaterial = () => {
  return useMutation({
    mutationFn: updateMaterial,
  });
};

export default useUpdateMaterial;
