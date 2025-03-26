import updateMaterialEstimateProject from "@/services/project/MaterialProject/updateMaterialEstimateProject.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateMaterialEstimateProject = () => {
  return useMutation({
    mutationFn: updateMaterialEstimateProject,
  });
};

export default useUpdateMaterialEstimateProject;
