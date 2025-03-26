import BackButton from "@/components/BackButton/BackButton";
import JobForm from "@/components/Job/JobForm/JobForm";
import useUpdateJob from "@/hooks/mutates/job/useUpdateJob";
import useGetJob from "@/hooks/queries/job/useGetJob";
import {
  type JobSchemaType,
  type MaterialJobSchemaType,
} from "@/schemas/job/job.schema";
import { Badge, Button, Card, InputLabel, Modal, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTable } from "mantine-datatable";
import { useDisclosure } from "@mantine/hooks";
import MaterialJobForm from "@/components/Job/MaterialJobForm/MaterialJobForm";
import useUpdateMaterialJob from "@/hooks/mutates/job/useUpdateMaterialJob";
import useDeleteMaterialJob from "@/hooks/mutates/job/useDeleteMaterialJob";
import useAddMaterialJob from "@/hooks/mutates/job/useAddMaterialJob";
import { DeleteConfirmModalConfig } from "@/config/ConfirmModalConfig/ConfirmModalConfig";
import { modals } from "@mantine/modals";
import { AxiosError } from "axios";

export default function ClientEdit(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const navigate = useRouter();
  const getJobApi = useGetJob({ job_id: props.id! });
  const updateJobApi = useUpdateJob();

  const updateMaterialJob = useUpdateMaterialJob();
  const deleteMaterialJob = useDeleteMaterialJob();
  const addMaterialJob = useAddMaterialJob();

  const onEdit = (data: JobSchemaType) => {
    const keyNotification = notifications.show({
      title: "กำลังโหลด",
      message: "กำลังแก้ไขงาน กรุณารอสักครู่...",
      color: "green",
      loading: true,
    });
    updateJobApi.mutate(
      {
        id: props.id!,
        description: data.description,
        name: data.name,
        unit: data.unit,
      },
      {
        onSuccess: () => {
          notifications.update({
            title: "สําเร็จ",
            message: "แก้ไขงาน สําเร็จ",
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
            loading: false,
            id: keyNotification,
          });
        },
      },
    );
  };

  const [openedAdd, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [openedEdit, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [EditMaterial, SetEditMaterial] = useState<MaterialJobSchemaType>();

  const onAddMeterialJob = (data: MaterialJobSchemaType) => {
    addMaterialJob.mutate(
      {
        job_id: props.id!,
        materials: [data],
      },
      {
        onSuccess: () => {
          notifications.show({
            title: "สําเร็จ",
            message: "เพิ่มวัสดุเข้างาน สําเร็จ",
            color: "green",
            loading: false,
          });
          closeAdd();
          getJobApi.refetch();
        },
      },
    );
  };

  const onEditMeterialJob = (data: MaterialJobSchemaType) => {
    updateMaterialJob.mutate(
      {
        job_id: props.id!,
        material_id: data.material_id,
        quantity: data.quantity,
      },
      {
        onSuccess: () => {
          notifications.show({
            title: "สําเร็จ",
            message: "แก้ไขจำนวน สําเร็จ",
            color: "green",
            loading: false,
          });
          closeEdit();
          getJobApi.refetch();
        },
      },
    );
  };

  const onDeleteMaterialJob = (data: MaterialJobSchemaType) => {
    modals.openConfirmModal({
      ...DeleteConfirmModalConfig,
      children: (
        <Text size="sm">
          คุณต้องการลบวัสดุออกจากงาน <b>{data.material_id}</b> ใช่หรือไม่ ?
        </Text>
      ),
      onConfirm: () => {
        deleteMaterialJob.mutate(
          {
            job_id: props.id!,
            material_id: data.material_id,
          },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "ลบวัสดุออกจากงาน สําเร็จ",
                color: "green",
              });
              getJobApi.refetch();
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
      },
    });
  };

  return (
    <>
      <Modal
        opened={openedAdd}
        onClose={closeAdd}
        title="เพิ่มวัสดุเข้างาน"
        centered
      >
        <MaterialJobForm type="create" onFinish={onAddMeterialJob} />
      </Modal>
      <Modal
        opened={openedEdit}
        onClose={closeEdit}
        title="แก้ไขจำนวน"
        centered
      >
        <MaterialJobForm
          data={EditMaterial}
          type="edit"
          onFinish={onEditMeterialJob}
        />
      </Modal>
      <div className="flex flex-col gap-3">
        <div>
          <BackButton label="ย้อนกลับไปหน้ารายการงาน" href="/job" />
        </div>
        <Card withBorder>
          <div className="flex justify-between">
            <Text size="xl" fw={700}>
              แก้ไขงาน
            </Text>
          </div>
          <JobForm
            data={{
              name: getJobApi.data?.data.name ?? "",
              description: getJobApi.data?.data.description ?? "",
              unit: getJobApi.data?.data.unit ?? "",
            }}
            onFinish={onEdit}
            type="edit"
          />
        </Card>
        <Card withBorder>
          <div className="mt-3 flex flex-col">
            <InputLabel>เลือกวัสดุ</InputLabel>
            <DataTable
              records={getJobApi.data?.data.materials}
              columns={[
                {
                  accessor: "material_id",
                  title: "รหัสวัสดุ",
                  render: (data) => <Badge>{data.material_id}</Badge>,
                },
                {
                  accessor: "name",
                  title: "ชื่อวัสดุ",
                },
                {
                  accessor: "unit",
                  title: "หน่วย",
                  render: (data) => (
                    <Badge variant="outline">{data.unit}</Badge>
                  ),
                },
                {
                  accessor: "quantity",
                  title: "จำนวน",
                },
                {
                  accessor: "material_id",
                  title: "",
                  render: (data) => (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          SetEditMaterial(data);
                          openEdit();
                        }}
                        size="compact-xs"
                      >
                        แก้ไข
                      </Button>
                      <Button
                        onClick={() => onDeleteMaterialJob(data)}
                        color="red"
                        size="compact-xs"
                      >
                        ลบ
                      </Button>
                    </div>
                  ),
                },
              ]}
            />
            <div className="mt-3 flex justify-center">
              <Button variant="outline" onClick={openAdd}>
                เพิ่มวัสดุ
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      id: context.query.id?.toString(),
    },
  };
}
