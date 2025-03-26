import updateJob from "@/services/job/updateJob.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateJob = () => {
  return useMutation({
    mutationFn: updateJob,
  });
};

export default useUpdateJob;
