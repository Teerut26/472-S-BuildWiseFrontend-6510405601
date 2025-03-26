import deleteMaterial from "@/services/material/deleteMaterial.service";
import { useMutation } from "@tanstack/react-query";

const useDeleteMaterial = () => {
  return useMutation({
    mutationFn: deleteMaterial,
  });
};

export default useDeleteMaterial;
