import getQuotationByProject, {
  type GetQuotationByProjectProps,
} from "@/services/quotation/getQuotationByProject.service";
import { useQuery } from "@tanstack/react-query";

const useGetQuotationByProject = (props: GetQuotationByProjectProps) => {
  return useQuery({
    queryKey: ["useGetQuotationByProject", props.project_id],
    queryFn: () => getQuotationByProject(props),
  });
};

export default useGetQuotationByProject;
