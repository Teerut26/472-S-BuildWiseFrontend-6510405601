import updateEstimateGeneralCostBoq from "@/services/boq/GeneralCostBoq/updateEstimateGeneralCostBoq.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateEstimateGeneralCost = () => {
  return useMutation({
    mutationFn: updateEstimateGeneralCostBoq,
  });
};

export default useUpdateEstimateGeneralCost;
