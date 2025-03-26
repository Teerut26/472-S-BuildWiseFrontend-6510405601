import BackButton from "@/components/BackButton/BackButton";
import { Text } from "@mantine/core";
import MaterialForm from "@/components/Material/MaterialForm/MaterialForm";
import { useRouter } from "next/router";
import useCreateMaterial from "@/hooks/mutates/material/useCreateMaterial";
import { MaterialSchemaType } from "@/schemas/material/material.schema";
import { notifications } from "@mantine/notifications";

export default function MaterialCreate() {
  const navigate = useRouter();
  const createMaterialApi = useCreateMaterial();

  const onCreate = (data: MaterialSchemaType) => {
    const keyNotification = notifications.show({
      title: "กำลังโหลด",
      message: "กำลังสร้างวัสดุ กรุณารอสักครู่...",
      color: "green",
      loading: true,
    });
    createMaterialApi.mutate(
      {
        name: data.name,
        unit: data.unit,
      },
      {
        onSuccess: () => {
          notifications.update({
            title: "สําเร็จ",
            message: "สร้างวัสดุ สําเร็จ",
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
        <BackButton label="ย้อนกลับไปหน้ารายการวัสดุ" href="/material" />
      </div>
      <div className="flex justify-between">
        <Text size="xl" fw={700}>
          เพิ่มวัสดุ
        </Text>
      </div>
      <MaterialForm onFinish={onCreate} type="create" />
    </div>
  );
}
