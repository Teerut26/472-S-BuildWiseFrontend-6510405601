import updateMaterialActualProject from "@/services/project/MaterialProject/updateMaterialActualProject.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateMaterialActualProject = () => {
  return useMutation({
    mutationFn: updateMaterialActualProject,
  });
};

export default useUpdateMaterialActualProject;
