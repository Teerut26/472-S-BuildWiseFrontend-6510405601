import getProjects from "@/services/project/getProjects.service";
import { useQuery } from "@tanstack/react-query";

const useGetProjects = () => {
  return useQuery({
    queryKey: ["GetProjects"],
    queryFn: () => getProjects(),
  });
};

export default useGetProjects;
