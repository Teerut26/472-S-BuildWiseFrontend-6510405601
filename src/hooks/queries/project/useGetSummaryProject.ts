import getSummayProject, {
  type GetSummaryProjectProps,
} from "@/services/project/getSummaryProject.service";
import { useQuery } from "@tanstack/react-query";

const useGetSummaryProject = (props: GetSummaryProjectProps) => {
  return useQuery({
    queryKey: ["useGetSummaryProject", props.id],
    queryFn: () => getSummayProject(props),
  });
};

export default useGetSummaryProject;
