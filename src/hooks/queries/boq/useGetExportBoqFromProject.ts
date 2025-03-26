import getExportBoqFromProject, {
  type GetExportBoqFromProjectProps,
} from "@/services/boq/getExportBoqFromProject.service";
import { useQuery } from "@tanstack/react-query";

const useGetExportBoqFromProject = (props: GetExportBoqFromProjectProps) => {
  return useQuery({
    queryKey: ["useGetExportBoqFromProject"],
    queryFn: () => getExportBoqFromProject(props),
  });
};

export default useGetExportBoqFromProject;
