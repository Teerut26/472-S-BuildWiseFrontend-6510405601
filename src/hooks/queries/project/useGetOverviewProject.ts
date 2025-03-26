import getOverviewProject, {
  type GetOverviewProjectProps,
} from "@/services/project/getOverviewProject.service";
import { useQuery } from "@tanstack/react-query";

const useGetOverviewProject = (props: GetOverviewProjectProps) => {
  return useQuery({
    queryKey: ["useGetOverviewProject", props.id],
    queryFn: () => getOverviewProject(props),
  });
};

export default useGetOverviewProject;
