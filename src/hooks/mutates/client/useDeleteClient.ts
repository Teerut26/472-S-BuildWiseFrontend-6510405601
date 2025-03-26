import deleteClient from "@/services/client/deleteClient.service";
import { useMutation } from "@tanstack/react-query";

const useDeleteClient = () => {
  return useMutation({
    mutationFn: deleteClient,
  });
};

export default useDeleteClient;
