import CompanyForm from "@/components/Company/CompanyForm/CompanyForm";
import useUpdateCompanyByUser from "@/hooks/mutates/company/useUpdateCompanyByUser";
import useGetCompanyByUser from "@/hooks/queries/company/useGetCompanyByUser";
import { type CompanySchemaType } from "@/schemas/company/company.schema";
import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useSession } from "next-auth/react";

export default function Company() {
  const { data: session } = useSession();
  const getCompanyByUser = useGetCompanyByUser({
    user_id: session?.user?.id ?? "",
  });
  const updateCompanyByUser = useUpdateCompanyByUser();

  const onEdit = (data: CompanySchemaType) => {
    updateCompanyByUser.mutate(
      {
        email: data.email,
        name: data.name,
        tel: data.tel,
        address: {
          address: data.address,
          district: data.district,
          subdistrict: data.subdistrict,
          province: data.province,
          postal_code: data.postal_code,
        },
        user_id: session?.user?.id ?? "",
        tax_id: data.tax_id,
      },
      {
        onSuccess: () => {
          notifications.show({
            title: "สําเร็จ",
            message: "แก้ไขบริษัท สําเร็จ",
            color: "green",
          });
          getCompanyByUser.refetch();
        },
        onError: (error) => {
          if (error instanceof AxiosError) {
            notifications.show({
              title: "เกิดข้อผิดพลาด",
              message: error.response?.data.error,
              color: "red",
            });
          }
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <Text size="lg" fw={500}>
        จัดการบริษัท
      </Text>
      {getCompanyByUser.data?.data && (
        <CompanyForm
          type="edit"
          data={{
            name: getCompanyByUser.data.data.name,
            email: getCompanyByUser.data.data.email,
            tel: getCompanyByUser.data.data.tel,
            district: getCompanyByUser.data.data.address.district,
            address: getCompanyByUser.data.data.address.address,
            subdistrict: getCompanyByUser.data.data.address.subdistrict,
            province: getCompanyByUser.data.data.address.province,
            postal_code: getCompanyByUser.data.data.address.postal_code,
            tax_id: getCompanyByUser.data.data.tax_id,
          }}
          onFinish={onEdit}
        />
      )}
    </div>
  );
}
