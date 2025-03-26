import BackButton from "@/components/BackButton/BackButton";
import ClientForm from "@/components/Client/ClientForm/ClientForm";
import useUpdateClient from "@/hooks/mutates/client/useUpdateClient";
import useGetClient from "@/hooks/queries/client/useGetClient";
import { ClientSchemaType } from "@/schemas/client/client.schema";
import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/navigation";

export default function ClientEdit(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const navigate = useRouter();
  const getClient = useGetClient({ client_id: props.id! });
  const updateClientApi = useUpdateClient();

  const onEdit = (data: ClientSchemaType) => {
    const keyNotification = notifications.show({
      title: "กำลังโหลด",
      message: "กำลังแก้ไขลูกค้า กรุณารอสักครู่...",
      color: "green",
      loading: true,
    });
    updateClientApi.mutate(
      {
        id: props.id!,
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
            message: "แก้ไขลูกค้า สําเร็จ",
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
            loading: false,
            id: keyNotification,
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
          แก้ไขลูกค้า
        </Text>
      </div>
      <ClientForm
        data={{
          address: getClient.data?.data.address.address! ?? "",
          district: getClient.data?.data.address.district ?? "",
          email: getClient.data?.data.email ?? "",
          name: getClient.data?.data.name ?? "",
          phone: getClient.data?.data.tel ?? "",
          postal_code: getClient.data?.data.address.postal_code ?? "",
          province: getClient.data?.data.address.province ?? "",
          subdistrict: getClient.data?.data.address.subdistrict ?? "",
          tax_id: getClient.data?.data.tax_id ?? "",
        }}
        onFinish={onEdit}
        type="edit"
      />
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      id: context.query.id?.toString(),
    },
  };
}
