import getGeneralCostBoq, {
  type GetGeneralCostBoqProps,
} from "@/services/boq/GeneralCostBoq/getGeneralCostBoq.service";
import { useQuery } from "@tanstack/react-query";

const useGetGeneralCosts = (props: GetGeneralCostBoqProps) => {
  return useQuery({
    queryKey: ["useGetGeneralCosts", props.project_id],
    queryFn: () => getGeneralCostBoq(props),
  });
};

export default useGetGeneralCosts;
