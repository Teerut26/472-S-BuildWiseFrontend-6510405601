import createSupplier from "@/services/supplier/createSupplier.service";
import { useMutation } from "@tanstack/react-query";

const useCreateSupplier = () => {
  return useMutation({
    mutationFn: createSupplier,
  });
};

export default useCreateSupplier;
