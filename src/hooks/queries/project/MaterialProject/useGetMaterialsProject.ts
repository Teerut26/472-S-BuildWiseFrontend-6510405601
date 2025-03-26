import getMaterialsProjectProject, {
  type GetMaterialsProjectProps,
} from "@/services/project/MaterialProject/getMaterialsProject.service";
import { useQuery } from "@tanstack/react-query";

const useGetMaterialsProject = (props: GetMaterialsProjectProps) => {
  return useQuery({
    queryKey: ["useGetMaterialsProject", props.project_id],
    queryFn: () => getMaterialsProjectProject(props),
  });
};

export default useGetMaterialsProject;
