import editContract from "@/services/contract/editContract.service";
import { useMutation } from "@tanstack/react-query";

const useEditContract = () => {
  return useMutation({
    mutationFn: editContract,
  });
};

export default useEditContract;
