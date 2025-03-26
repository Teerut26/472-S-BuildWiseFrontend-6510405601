import updateCompanyByUser from "@/services/company/updateCompanyByUser.service";
import { useMutation } from "@tanstack/react-query";

const useUpdateCompanyByUser = () => {
  return useMutation({
    mutationFn: updateCompanyByUser,
  });
};

export default useUpdateCompanyByUser;
