import getJobs from "@/services/job/getJobs.service";
import { useQuery } from "@tanstack/react-query";

const useGetJobs = () => {
  return useQuery({
    queryKey: ["useGetJobs"],
    queryFn: () => getJobs(),
  });
};

export default useGetJobs;
