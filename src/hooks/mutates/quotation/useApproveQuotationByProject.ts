import approveQuotationByProject from "@/services/quotation/approveQuotationByProject.service";
import { useMutation } from "@tanstack/react-query";

const useApproveQuotationByProject = () => {
  return useMutation({
    mutationFn: approveQuotationByProject,
  });
};

export default useApproveQuotationByProject;
