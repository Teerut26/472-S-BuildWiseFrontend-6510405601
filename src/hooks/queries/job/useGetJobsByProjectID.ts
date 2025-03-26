import getJobsByProjectID, {
  type getJobsByProjectIDProps,
} from "@/services/job/getJobsByProjectID.service";
import { useQuery } from "@tanstack/react-query";

const useGetJobsByProjectID = (props: getJobsByProjectIDProps, key?: string) => {
  return useQuery({
    queryKey: ["useGetJobsByProjectID", key],
    queryFn: () => getJobsByProjectID(props),
    refetchOnWindowFocus: false,
  });
};

export default useGetJobsByProjectID;
