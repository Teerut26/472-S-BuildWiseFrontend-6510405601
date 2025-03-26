import deleteSupplier from "@/services/supplier/deleteSupplier.service";
import { useMutation } from "@tanstack/react-query";

const useDeleteSupplier = () => {
  return useMutation({
    mutationFn: deleteSupplier,
  });
};

export default useDeleteSupplier;
