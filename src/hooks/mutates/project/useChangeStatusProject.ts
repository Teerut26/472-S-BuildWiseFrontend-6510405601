import changeStatusProject from "@/services/project/changeStatusProject.service";
import { useMutation } from "@tanstack/react-query";

const useChangeStatusProject = () => {
  return useMutation({
    mutationFn: changeStatusProject,
  });
};

export default useChangeStatusProject;
