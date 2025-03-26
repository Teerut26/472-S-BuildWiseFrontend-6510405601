import createMaterial from "@/services/material/createMaterial.service";
import { useMutation } from "@tanstack/react-query";

const useCreateMaterial = () => {
  return useMutation({
    mutationFn: createMaterial,
  });
};

export default useCreateMaterial;
