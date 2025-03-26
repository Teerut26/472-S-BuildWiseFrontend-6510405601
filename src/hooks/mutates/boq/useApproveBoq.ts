import approveBoq from "@/services/boq/approveBoq.service";
import { useMutation } from "@tanstack/react-query";

const useApproveBoq = () => {
  return useMutation({
    mutationFn: approveBoq,
  });
};

export default useApproveBoq;
