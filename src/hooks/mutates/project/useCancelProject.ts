import cancelProject from "@/services/project/cancelProject.service";
import { useMutation } from "@tanstack/react-query";

const useCancelProject = () => {
  return useMutation({
    mutationFn: cancelProject,
  });
};

export default useCancelProject;
