import addMaterialJob from "@/services/job/material-job/addMaterialJob.service";
import { useMutation } from "@tanstack/react-query";

const useAddMaterialJob = () => {
  return useMutation({
    mutationFn: addMaterialJob,
  });
};

export default useAddMaterialJob;
