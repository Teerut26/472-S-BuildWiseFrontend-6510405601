import BackButton from "@/components/BackButton/BackButton";
import { Text } from "@mantine/core";
import ClientForm from "@/components/Client/ClientForm/ClientForm";
import { useRouter } from "next/router";
import useCreateClient from "@/hooks/mutates/client/useCreateClient";
import { ClientSchemaType } from "@/schemas/client/client.schema";
import { notifications } from "@mantine/notifications";

export default function ClientCreate() {
  const navigate = useRouter();
  const createClientApi = useCreateClient();

  const onCreate = (data: ClientSchemaType) => {
    const keyNotification = notifications.show({
      title: "กำลังโหลด",
      message: "กำลังสร้างลูกค้า กรุณารอสักครู่...",
      color: "green",
      loading: true,
    });
    createClientApi.mutate(
      {
        name: data.name,
        address: {
          address: data.address,
          district: data.district,
          postal_code: data.postal_code,
          province: data.province,
          subdistrict: data.subdistrict,
        },
        email: data.email,
        tel: data.phone,
        tax_id: data.tax_id,
      },
      {
        onSuccess: () => {
          notifications.update({
            title: "สําเร็จ",
            message: "สร้างลูกค้า สําเร็จ",
            color: "green",
            id: keyNotification,
            loading: false,
          });
          navigate.push("/client");
        },
        onError: (error) => {
          notifications.update({
            title: "เกิดข้อผิดพลาด",
            message: error.message,
            color: "red",
            id: keyNotification,
            loading: false,
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col">
      <div>
        <BackButton label="ย้อนกลับไปหน้ารายการ Client" href="/client" />
      </div>
      <div className="flex justify-between">
        <Text size="xl" fw={700}>
          สร้างลูกค้า
        </Text>
      </div>
      <ClientForm onFinish={onCreate} type="create" />
    </div>
  );
}
