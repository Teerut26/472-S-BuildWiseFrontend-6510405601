import createClient from "@/services/client/createClient.service";
import { useMutation } from "@tanstack/react-query";

const useCreateClient = () => {
  return useMutation({
    mutationFn: createClient,
  });
};

export default useCreateClient;
