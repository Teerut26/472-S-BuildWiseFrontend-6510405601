import BackButton from "@/components/BackButton/BackButton";
import { Text } from "@mantine/core";
import SupplierForm from "@/components/Supplier/SupplierForm/SupplierForm";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { SupplierSchemaType } from "@/schemas/supplier/supplier.schema";
import useCreateSupplier from "@/hooks/mutates/supplier/useCreateSupplier";

export default function SupplierCreate() {
  const navigate = useRouter();
  const createSupplierApi = useCreateSupplier();

  const onCreate = (data: SupplierSchemaType) => {
    const keyNotification = notifications.show({
      title: "กำลังโหลด",
      message: "กำลังสร้างซัพพลายเออร์ กรุณารอสักครู่...",
      color: "green",
      loading: true,
    });
    createSupplierApi.mutate(
      {
        tel: data.phone,
        name: data.name,
        email: data.email,
        address: {
          address: data.address,
          district: data.district,
          postal_code: data.postal_code,
          province: data.province,
          subdistrict: data.subdistrict,
        },
      },
      {
        onSuccess: () => {
          notifications.update({
            title: "สําเร็จ",
            message: "สร้างซัพพลายเออร์ สําเร็จ",
            color: "green",
            id: keyNotification,
            loading: false,
          });
          navigate.push("/supplier");
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
        <BackButton label="ย้อนกลับไปหน้ารายการซัพพลายเออร์" href="/supplier" />
      </div>
      <div className="flex justify-between">
        <Text size="xl" fw={700}>
          สร้างซัพพลายเออร์
        </Text>
      </div>
      <SupplierForm onFinish={onCreate} type="create" />
    </div>
  );
}
