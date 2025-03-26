import updateMaterialJob from "@/services/job/material-job/updateMaterialJob.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateMaterialJob = () => {
  return useMutation({
    mutationFn: updateMaterialJob,
  });
};

export default useUpdateMaterialJob;
