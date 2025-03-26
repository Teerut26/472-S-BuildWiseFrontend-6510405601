import updateSellingPriceQuotationByProject from "@/services/quotation/updateSellingPriceQuotationByProject.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateSellingPriceQuotationByProject = () => {
  return useMutation({
    mutationFn: updateSellingPriceQuotationByProject,
  });
};

export default useUpdateSellingPriceQuotationByProject;
