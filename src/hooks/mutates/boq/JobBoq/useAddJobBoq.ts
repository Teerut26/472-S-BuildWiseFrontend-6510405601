import addJobBoq from "@/services/boq/JobBoq/addJobBoq.service";
import { useMutation } from "@tanstack/react-query";

const useAddJobBoq = () => {
  return useMutation({
    mutationFn: addJobBoq,
  });
};

export default useAddJobBoq;
