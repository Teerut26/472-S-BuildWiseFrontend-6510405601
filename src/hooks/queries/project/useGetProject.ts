import getProject, { type GetProjectProps } from "@/services/project/getProject.service";
import { useQuery } from "@tanstack/react-query";

const useGetProject = (props: GetProjectProps) => {
  return useQuery({
    queryKey: ["GetProject", props.id],
    queryFn: () => getProject(props),
  });
};

export default useGetProject;
