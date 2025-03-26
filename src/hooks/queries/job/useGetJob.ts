import getJob, { type GetJobProps } from "@/services/job/getJob.service";
import { useQuery } from "@tanstack/react-query";

const useGetJob = (props: GetJobProps) => {
  return useQuery({
    queryKey: ["useGetJob"],
    queryFn: () => getJob(props),
  });
};

export default useGetJob;
