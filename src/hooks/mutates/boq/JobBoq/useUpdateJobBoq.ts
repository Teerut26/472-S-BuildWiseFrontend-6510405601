import updateJobBoq from "@/services/boq/JobBoq/updateJobBoq.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateJobBoq = () => {
  return useMutation({
    mutationFn: updateJobBoq,
  });
};

export default useUpdateJobBoq;
