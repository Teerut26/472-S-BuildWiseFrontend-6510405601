import BackButton from "@/components/BackButton/BackButton";
import ProjectForm from "@/components/Project/ProjectForm/ProjectForm";
import useCreateProject from "@/hooks/mutates/project/useCreateProject";
import { ProjectSchemaType } from "@/schemas/project/project.schema";
import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";

export default function CreateProject() {
  const navigate = useRouter();
  const createProjectApi = useCreateProject();

  const onCreate = (data: ProjectSchemaType) => {
    const keyNotification = notifications.show({
      title: "กำลังโหลด",
      message: "กำลังสร้างโครงการ กรุณารอสักครู่...",
      color: "green",
      loading: true,
    });
    createProjectApi.mutate(
      {
        address: {
          district: data.district,
          province: data.province,
          subdistrict: data.subdistrict,
          postal_code: data.postal_code,
          address: data.address,
        },
        client_id: data.client_id!,
        name: data.project_name,
        description: data.project_details,
      },
      {
        onSuccess: () => {
          notifications.update({
            title: "สําเร็จ",
            message: "สร้างโครงการ สําเร็จ",
            color: "green",
            id: keyNotification,
            loading: false,
          });
          navigate.push("/project");
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
        <BackButton href="/project" />
      </div>
      <Text size="xl" fw={700}>
        สร้างโครงการใหม่
      </Text>
      <ProjectForm onFinish={onCreate} type="create" />
    </div>
  );
}
