import updateClient from "@/services/client/updateClient.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateClient = () => {
  return useMutation({
    mutationFn: updateClient,
  });
};

export default useUpdateClient;
