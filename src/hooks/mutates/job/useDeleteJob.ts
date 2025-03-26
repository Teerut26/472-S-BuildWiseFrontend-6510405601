import deleteJob from "@/services/job/deleteJob.service";
import { useMutation } from "@tanstack/react-query";

const useDeleteJob = () => {
  return useMutation({
    mutationFn: deleteJob,
  });
};

export default useDeleteJob;
