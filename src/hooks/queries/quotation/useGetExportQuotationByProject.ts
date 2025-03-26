import getExportQuotationByProject, { type GetExportQuotationByProjectProps } from "@/services/quotation/getExportQuotationByProject.service";
import getQuotationByProject from "@/services/quotation/getQuotationByProject.service";
import { useQuery } from "@tanstack/react-query";

const useGetExportQuotationByProject = (
  props: GetExportQuotationByProjectProps,
) => {
  return useQuery({
    queryKey: ["useGetExportQuotationByProject", props.project_id],
    queryFn: () => getExportQuotationByProject(props),
  });
};

export default useGetExportQuotationByProject;
