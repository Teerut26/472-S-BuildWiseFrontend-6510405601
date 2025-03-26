import deleteProject from "@/services/project/deleteProject.service";
import { useMutation } from "@tanstack/react-query";

const useDeleteProject = () => {
  return useMutation({
    mutationFn: deleteProject,
  });
};

export default useDeleteProject;
