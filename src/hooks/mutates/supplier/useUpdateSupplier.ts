import updateSupplier from "@/services/supplier/updateSupplier.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateSupplier = () => {
  return useMutation({
    mutationFn: updateSupplier,
  });
};

export default useUpdateSupplier;
