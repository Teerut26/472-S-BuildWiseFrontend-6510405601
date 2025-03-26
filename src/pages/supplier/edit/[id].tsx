import BackButton from "@/components/BackButton/BackButton";
import SupplierForm from "@/components/Supplier/SupplierForm/SupplierForm";
import useUpdateSupplier from "@/hooks/mutates/supplier/useUpdateSupplier";
import useGetSupplier from "@/hooks/queries/supplier/useGetSupplier";
import { SupplierSchemaType } from "@/schemas/supplier/supplier.schema";
import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/navigation";

export default function SupplierEdit(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const navigate = useRouter();
  const getSupplierApi = useGetSupplier({ supplier_id: props.id! });
  const updateSupplier = useUpdateSupplier();

  const onEdit = (data: SupplierSchemaType) => {
    const keyNotification = notifications.show({
      title: "กำลังโหลด",
      message: "กำลังแก้ไขซัพพลายเออร์ กรุณารอสักครู่...",
      color: "green",
      loading: true,
    });
    updateSupplier.mutate(
      {
        id: props.id!,
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
            message: "แก้ไขซัพพลายเออร์ สําเร็จ",
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
        <BackButton label="ย้อนกลับไปหน้ารายการซัพพลายเออร์" href="/supplier" />
      </div>
      <div className="flex justify-between">
        <Text size="xl" fw={700}>
          แก้ไขซัพพลายเออร์
        </Text>
      </div>
      <SupplierForm
        data={{
          address: getSupplierApi.data?.data.address.address ?? "",
          district: getSupplierApi.data?.data.address.district ?? "",
          email: getSupplierApi.data?.data.email ?? "",
          name: getSupplierApi.data?.data.name ?? "",
          phone: getSupplierApi.data?.data.tel ?? "",
          postal_code: getSupplierApi.data?.data.address.postal_code ?? "",
          province: getSupplierApi.data?.data.address.province ?? "",
          subdistrict: getSupplierApi.data?.data.address.subdistrict ?? "",
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
