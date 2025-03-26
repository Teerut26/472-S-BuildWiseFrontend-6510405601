import createProject from "@/services/project/createProject.service";
import { useMutation } from "@tanstack/react-query";

const useCreateProject = () => {
  return useMutation({
    mutationFn: createProject,
  });
};

export default useCreateProject;
