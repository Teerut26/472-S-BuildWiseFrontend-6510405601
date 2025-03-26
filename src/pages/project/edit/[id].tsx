import BackButton from "@/components/BackButton/BackButton";
import ProjectForm from "@/components/Project/ProjectForm/ProjectForm";
import useUpdateProject from "@/hooks/mutates/project/useUpdateProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import { ProjectSchemaType } from "@/schemas/project/project.schema";
import { Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/navigation";

export default function ProjectEdit(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const navigate = useRouter();
  const getProjectApi = useGetProject({ id: props.id! });
  const updateProjectApi = useUpdateProject();

  const onEdit = (data: ProjectSchemaType) => {
    const keyNotification = notifications.show({
      title: "กำลังโหลด",
      message: "กำลังแก้ไขโครงการ กรุณารอสักครู่...",
      color: "green",
      loading: true,
    });
    updateProjectApi.mutate(
      {
        address: {
          address: data.address,
          district: data.district,
          province: data.province,
          postal_code: data.postal_code,
          subdistrict: data.subdistrict,
        },
        id: props.id!,
        name: data.project_name,
        description: data.project_details,
        client_id: data.client_id!,
      },
      {
        onSuccess: () => {
          notifications.update({
            title: "สําเร็จ",
            message: "แก้ไขโครงการ สําเร็จ",
            color: "green",
            id: keyNotification,
            loading: false,
          });
          navigate.push("/project/" + props.id);
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
        <BackButton />
      </div>
      <Text size="xl" fw={700}>
        แก้ไขโครงการ
      </Text>
      <ProjectForm
        onFinish={onEdit}
        data={{
          district: getProjectApi.data?.data.address.district ?? "",
          province: getProjectApi.data?.data.address.province ?? "",
          subdistrict: getProjectApi.data?.data.address.subdistrict ?? "",
          client_id: getProjectApi.data?.data.client_id ?? "",
          postal_code: getProjectApi.data?.data.address.postal_code ?? "",
          address: getProjectApi.data?.data.address.address ?? "",
          project_name: getProjectApi.data?.data.name ?? "",
          project_details: getProjectApi.data?.data.description ?? "",
        }}
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
