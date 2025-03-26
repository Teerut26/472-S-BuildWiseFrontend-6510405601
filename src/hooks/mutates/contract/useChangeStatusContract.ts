import changeStatusContract from "@/services/contract/changeStatusContract.service";
import { useMutation } from "@tanstack/react-query";

const useChangeStatusContract = () => {
  return useMutation({
    mutationFn: changeStatusContract,
  });
};

export default useChangeStatusContract;
