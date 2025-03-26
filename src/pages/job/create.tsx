import BackButton from "@/components/BackButton/BackButton";
import JobForm from "@/components/Job/JobForm/JobForm";
import useCreateJob from "@/hooks/mutates/job/useCreateJob";
import { JobSchemaType } from "@/schemas/job/job.schema";
import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export default function JobCreate() {
  const navigate = useRouter();
  const createJobApi = useCreateJob();

  const onCreate = (data: JobSchemaType) => {
    const keyNotification = notifications.show({
      title: "กำลังโหลด",
      message: "กำลังสร้างงาน กรุณารอสักครู่...",
      color: "green",
      loading: true,
    });
    createJobApi.mutate(
      {
        description: data.description,
        name: data.name,
        unit: data.unit,
      },
      {
        onSuccess: () => {
          notifications.update({
            title: "สําเร็จ",
            message: "สร้างงาน สําเร็จ",
            color: "green",
            id: keyNotification,
            loading: false,
          });
          navigate.push("/job");
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
        <BackButton label="ย้อนกลับไปหน้ารายการงาน" href="/job" />
      </div>
      <div className="flex justify-between">
        <Text size="xl" fw={700}>
          เพิ่มงาน
        </Text>
      </div>
      <JobForm onFinish={onCreate} type="create" />
    </div>
  );
}
