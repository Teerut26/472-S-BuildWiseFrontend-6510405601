import getBoqFromProject, {
  type GetBoqFromProjectProps,
} from "@/services/boq/getBoqFromProject.service";
import { useQuery } from "@tanstack/react-query";

const useGetBoqFromProject = (props: GetBoqFromProjectProps) => {
  return useQuery({
    queryKey: ["useGetBoqFromProject"],
    queryFn: () => getBoqFromProject(props),
  });
};

export default useGetBoqFromProject;
