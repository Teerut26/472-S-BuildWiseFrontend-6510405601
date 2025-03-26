import updateActualGeneralCost from "@/services/generalCost/updateActualGeneralCost.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateActualGeneralCost = () => {
  return useMutation({
    mutationFn: updateActualGeneralCost,
  });
};

export default useUpdateActualGeneralCost;
