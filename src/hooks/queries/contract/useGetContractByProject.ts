import getContractByProject, {
  type GetContractByProjectProps,
} from "@/services/contract/getContractByProject.service";
import { useQuery } from "@tanstack/react-query";

const useGetContractByProject = (
  props: GetContractByProjectProps
) => {
  return useQuery({
    queryKey: ["useGetContractByProject", props.project_id],
    queryFn: () => getContractByProject(props),
    enabled: !!props.project_id,
  });
};

export default useGetContractByProject;
