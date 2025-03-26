import createJob from "@/services/job/createJob.service";
import { useMutation } from "@tanstack/react-query";

const useCreateJob = () => {
  return useMutation({
    mutationFn: createJob,
  });
};

export default useCreateJob;
