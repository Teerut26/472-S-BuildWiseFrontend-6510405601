import BackButton from "@/components/BackButton/BackButton";
import MaterialForm from "@/components/Material/MaterialForm/MaterialForm";
import useUpdateMaterial from "@/hooks/mutates/material/useUpdateMaterial";
import useGetMaterial from "@/hooks/queries/material/useGetMaterial";
import { MaterialSchemaType } from "@/schemas/material/material.schema";
import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/navigation";

export default function MaterialEdit(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const navigate = useRouter();
  const getClient = useGetMaterial({ material_id: props.id! });
  const updateClientApi = useUpdateMaterial();

  const onEdit = (data: MaterialSchemaType) => {
    const keyNotification = notifications.show({
      title: "กำลังโหลด",
      message: "กำลังแก้ไขวัสดุ กรุณารอสักครู่...",
      color: "green",
      loading: true,
    });
    updateClientApi.mutate(
      {
        id: props.id!,
        name: data.name,
        unit: data.unit,
      },
      {
        onSuccess: () => {
          notifications.update({
            title: "สําเร็จ",
            message: "แก้ไขวัสดุ สําเร็จ",
            color: "green",
            id: keyNotification,
            loading: false,
          });
          navigate.push("/material");
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
        <BackButton label="ย้อนกลับไปหน้ารายการวัสดุ" href="/material" />
      </div>
      <div className="flex justify-between">
        <Text size="xl" fw={700}>
          แก้ไขวัสดุ
        </Text>
      </div>
      <MaterialForm
        data={{
          name: getClient.data?.data.name!,
          unit: getClient.data?.data.unit!,
        }}
        type="edit"
        onFinish={onEdit}
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
