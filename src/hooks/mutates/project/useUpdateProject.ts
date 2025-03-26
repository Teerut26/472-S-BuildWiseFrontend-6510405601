import updateProject from "@/services/project/updateProject.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateProject = () => {
  return useMutation({
    mutationFn: updateProject,
  });
};

export default useUpdateProject;
