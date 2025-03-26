import getCompanyByUser, {
  type GetCompanyByUserProps,
} from "@/services/company/getCompanyByUser.service";
import { useQuery } from "@tanstack/react-query";

const useGetCompanyByUser = (props: GetCompanyByUserProps) => {
  return useQuery({
    queryKey: ["useGetCompanyByUser", props.user_id],
    queryFn: () => getCompanyByUser(props),
    enabled: !!props.user_id,
  });
};

export default useGetCompanyByUser;
