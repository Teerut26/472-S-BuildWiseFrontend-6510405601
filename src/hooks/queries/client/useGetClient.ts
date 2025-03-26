import getClient, { GetClientProps } from "@/services/client/getClient.service";
import { useQuery } from "@tanstack/react-query";

const useGetClient = (props: GetClientProps) => {
  return useQuery({
    queryKey: ["GetClient", props.client_id],
    queryFn: () => getClient(props),
  });
};

export default useGetClient;
