import BackButton from "@/components/BackButton/BackButton";
import { FieldLabel } from "@/components/FieldLabel/FieldLabel";
import { DeleteConfirmModalConfig } from "@/config/ConfirmModalConfig/ConfirmModalConfig";
import useCancelProject from "@/hooks/mutates/project/useCancelProject";
import useChangeStatusProject from "@/hooks/mutates/project/useChangeStatusProject";
import useGetBoqFromProject from "@/hooks/queries/boq/useGetBoqFromProject";
import useGetOverviewProject from "@/hooks/queries/project/useGetOverviewProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import { getBoqStatusMap } from "@/utils/boqStatusMap";
import { getProjectStatusMap } from "@/utils/projectStatusMap";
import { getQuotationStatusMap } from "@/utils/quotationStatusMap";
import {
  Badge,
  Button,
  Card,
  Divider,
  NumberFormatter,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import clsx from "clsx";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import Link from "next/link";

export default function Project(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const getProjectApi = useGetProject({
    id: props.id ?? "",
  });
  const getBoqFromProject = useGetBoqFromProject({
    project_id: props.id ?? "",
  });
  const getQuoTationByProject = useGetQuotationByProject({
    project_id: props.id ?? "",
  });

  const getOverviewProject = useGetOverviewProject({ id: props.id ?? "" });

  const changeStatusProject = useChangeStatusProject();
  const cancelProject = useCancelProject();

  const changeStatus = () => {
    const boqStatus = getBoqFromProject.data?.data.status;
    const quotationStatus = getQuoTationByProject.data?.data.status;
    const projectStatus = getProjectApi.data?.data.status;

    if (
      boqStatus === "approved" &&
      quotationStatus === "approved" &&
      projectStatus === "planning"
    ) {
      modals.openConfirmModal({
        title: "ยืนยันการเปลี่ยนสถานะโครงการ",
        children: (
          <div className="flex items-center gap-1">
            ยืนยันการเปลี่ยนสถานะโครงการเป็น
            <Badge>กำลังดำเนินการ</Badge>
          </div>
        ),
        labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
        onConfirm: () => {
          changeStatusProject.mutate(
            {
              project_id: props.id!,
              status: "in_progress",
            },
            {
              onSuccess: () => {
                notifications.show({
                  title: "สําเร็จ",
                  message: "เปลี่ยนสถานะโครงการเรียบร้อย",
                });
                getQuoTationByProject.refetch();
                getBoqFromProject.refetch();
                getProjectApi.refetch();
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
    } else if (
      boqStatus === "approved" &&
      quotationStatus === "approved" &&
      projectStatus === "in_progress"
    ) {
      modals.openConfirmModal({
        title: "ยืนยันการเปลี่ยนสถานะโครงการ",
        children: (
          <div className="flex items-center gap-1">
            ยืนยันการเปลี่ยนสถานะโครงการเป็น
            <Badge>เสร็จสิ้น</Badge>
          </div>
        ),
        labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
        onConfirm: () => {
          changeStatusProject.mutate(
            {
              project_id: props.id!,
              status: "completed",
            },
            {
              onSuccess: () => {
                notifications.show({
                  title: "สําเร็จ",
                  message: "เปลี่ยนสถานะโครงการเรียบร้อย",
                });
                getQuoTationByProject.refetch();
                getBoqFromProject.refetch();
                getProjectApi.refetch();
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
    }
  };

  const isChangeStatusValid = () => {
    const boqStatus = getBoqFromProject.data?.data.status;
    const quotationStatus = getQuoTationByProject.data?.data.status;
    const projectStatus = getProjectApi.data?.data.status;

    if (
      boqStatus === "approved" &&
      quotationStatus === "approved" &&
      projectStatus === "planning"
    ) {
      return true;
    }

    if (
      boqStatus === "approved" &&
      quotationStatus === "approved" &&
      projectStatus === "in_progress"
    ) {
      return true;
    }

    return false;
  };

  const isSummaryValid = () => {
    const boqStatus = getBoqFromProject.data?.data.status;
    const quotationStatus = getQuoTationByProject.data?.data.status;
    const projectStatus = getProjectApi.data?.data.status;

    if (
      boqStatus === "approved" &&
      quotationStatus === "approved" &&
      projectStatus === "completed"
    ) {
      return true;
    }
    return false;
  };

  const onCancelProject = () => {
    modals.openConfirmModal({
      ...DeleteConfirmModalConfig,
      labels: { confirm: "ยกเลิกโครงการ", cancel: "ยกเลิก" },
      children: (
        <Text size="sm">
          คุณแน่ใจหรือไม่ว่าต้องการยกเลิกโครงการ{" "}
          <Badge>{getProjectApi.data?.data.name}</Badge>
        </Text>
      ),
      onConfirm: () => {
        cancelProject.mutate(
          {
            project_id: props.id!,
          },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "ยกเลิกโครงการเรียบร้อย",
              });
              getProjectApi.refetch();
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
    <div className="flex flex-col">
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <BackButton label="ย้อนกลับไปหน้ารายการโครงการ" href="/project" />
          <Text fz={"xl"} fw={700}>
            {getProjectApi.data?.data.name}
          </Text>
        </div>
        <div className="flex gap-1">
          <Link href={`/project/${props.id}/boq`}>
            <Button variant="white">BOQ</Button>
          </Link>

          {getBoqFromProject.data?.data.status === "approved" ? (
            <Link href={`/project/${props.id}/quotation`}>
              <Button variant="white">ใบเสนอราคา</Button>
            </Link>
          ) : (
            <Button disabled variant="white">
              ใบเสนอราคา
            </Button>
          )}
          <Link href={`/project/${props.id}/material`}>
            <Button variant="white">วัสดุ</Button>
          </Link>

          <Link href={`/project/${props.id}/general-cost`}>
            <Button variant="white">ค่าใช้จ่ายทั่วไป</Button>
          </Link>
          <Link href={`/project/${props.id}/document`}>
            <Button variant="white">เอกสาร</Button>
          </Link>
          {isSummaryValid() ? (
            <Link href={`/project/${props.id}/summary`}>
              <Button variant="white">สรุป</Button>
            </Link>
          ) : (
            <Button disabled variant="white">
              สรุป
            </Button>
          )}
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3">
        <div className="flex gap-3">
          <Button
            disabled={!isChangeStatusValid()}
            size="xs"
            onClick={changeStatus}
          >
            เปลี่ยนสถานะ
          </Button>
          <Button
            disabled={getProjectApi.data?.data.status === "cancelled"}
            size="xs"
            onClick={onCancelProject}
            color="red"
          >
            ยกเลิกโครงการ
          </Button>
        </div>
        <Card withBorder className="flex gap-3">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="text-lg font-semibold">รายละเอียด</div>
              </div>
              <div className="flex flex-col">
                <FieldLabel labelClass="min-w-[5.4rem]" label="ชื่อโครงการ">
                  {getProjectApi.data?.data.name}
                </FieldLabel>
                <FieldLabel labelClass="min-w-[5.4rem]" label="สถานที่">
                  {getProjectApi.data?.data.address.address},{" "}
                  {getProjectApi.data?.data.address.subdistrict},{" "}
                  {getProjectApi.data?.data.address.district},{" "}
                  {getProjectApi.data?.data.address.province},{" "}
                  {getProjectApi.data?.data.address.postal_code}
                </FieldLabel>
                <FieldLabel labelClass="min-w-[5.4rem]" label="ลูกค้า">
                  {getProjectApi.data?.data.client.name}
                </FieldLabel>
                <FieldLabel labelClass="min-w-[5.4rem]" label="สถานะ">
                  {
                    getProjectStatusMap(getProjectApi.data?.data.status ?? "")
                      ?.label
                  }
                </FieldLabel>
              </div>
            </div>
            {getProjectApi.data?.data.status !== "cancelled" ? (
              <Link href={"/project/edit/" + props.id}>
                <Button>แก้ไขรายละเอียด</Button>
              </Link>
            ) : (
              <Button disabled>แก้ไขรายละเอียด</Button>
            )}
          </div>
        </Card>
        <Card withBorder className="flex flex-col">
          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <div className="text-lg font-semibold">ภาพรวม</div>
              </div>
              <div className="flex justify-between gap-10">
                <div className="flex flex-col">
                  <FieldLabel labelClass="min-w-[8rem]" label="สถานะ BOQ">
                    {
                      getBoqStatusMap(getBoqFromProject.data?.data.status!)
                        ?.label
                    }
                  </FieldLabel>
                  <FieldLabel labelClass="min-w-[8rem]" label="Quotation สถานะ">
                    {
                      getQuotationStatusMap(
                        getQuoTationByProject.data?.data.status ?? "",
                      )?.label
                    }
                  </FieldLabel>
                  <Divider my={5} />
                  <FieldLabel
                    labelClass="min-w-[8rem]"
                    label="ต้นทุนประเมินรวม"
                  >
                    <NumberFormatter
                      value={getOverviewProject.data?.data.total_overall_cost?.toFixed(
                        2,
                      )}
                      thousandSeparator
                    />
                  </FieldLabel>
                  <FieldLabel labelClass="min-w-[8rem]" label="ราคาขาย">
                    <NumberFormatter
                      value={getOverviewProject.data?.data.total_selling_price?.toFixed(
                        2,
                      )}
                      thousandSeparator
                    />
                  </FieldLabel>
                  <FieldLabel labelClass="min-w-[8rem]" label="ราคาขายรวมภาษี">
                    <NumberFormatter
                      value={getOverviewProject.data?.data.total_with_tax?.toFixed(
                        2,
                      )}
                      thousandSeparator
                    />
                  </FieldLabel>
                  <FieldLabel labelClass="min-w-[8rem]" label="กำไรประเมิน">
                    <NumberFormatter
                      value={getOverviewProject.data?.data.estimated_profit?.toFixed(
                        2,
                      )}
                      thousandSeparator
                    />
                  </FieldLabel>
                  <FieldLabel labelClass="min-w-[8rem]" label="ต้นทุนจริงรวม">
                    <NumberFormatter
                      value={getOverviewProject.data?.data.total_actual_cost?.toFixed(
                        2,
                      )}
                      thousandSeparator
                    />
                  </FieldLabel>
                  <FieldLabel labelClass="min-w-[8rem]" label="กำไรจริง">
                    <NumberFormatter
                      value={getOverviewProject.data?.data.actual_profit?.toFixed(
                        2,
                      )}
                      thousandSeparator
                    />
                  </FieldLabel>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
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
