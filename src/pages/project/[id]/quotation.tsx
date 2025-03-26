import BackButton from "@/components/BackButton/BackButton";
import QuotationForm from "@/components/Quotation/QuotationForm/QuotationForm";
import useApproveQuotationByProject from "@/hooks/mutates/quotation/useApproveQuotationByProject";
import useUpdateSellingPriceQuotationByProject from "@/hooks/mutates/quotation/useUpdateSellingPriceQuotationByProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import { type QuotationSchemaType } from "@/schemas/quotation/quotation.schema";
import { getQuotationStatusMap } from "@/utils/quotationStatusMap";
import { Badge, Button, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconFileText } from "@tabler/icons-react";
import { AxiosError } from "axios";
import {
  type GetServerSidePropsContext,
  type InferGetServerSidePropsType,
} from "next";
import { useSession } from "next-auth/react";

export default function Quotation(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const { data: session } = useSession();
  const getProjectApi = useGetProject({
    id: props.id ?? "",
  });
  const getQuotationByProject = useGetQuotationByProject({
    project_id: props.id ?? "",
  });
  const approveQuotationByProject = useApproveQuotationByProject();
  const updateSellingPriceQuotationByProject =
    useUpdateSellingPriceQuotationByProject();

  const onChangeStatus = () => {
    modals.openConfirmModal({
      title: "ยืนยันการเปลี่ยนสถานะ",
      centered: true,
      children: (
        <div className="flex items-center gap-1">
          คุณต้องการเปลี่ยนสถานะเป็น <Badge>อนุมัติ</Badge> ใช่หรือไม่ ?
        </div>
      ),
      labels: { confirm: "ยืนยัน", cancel: "ยกเลิก" },
      onConfirm: () => {
        approveQuotationByProject.mutate(
          { project_id: getProjectApi.data?.data.id! },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "อนุมัติใบเสนอราคาสําเร็จ",
                color: "green",
              });
              getQuotationByProject.refetch();
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

  const isDisable = getQuotationByProject.data?.data.status === "approved";

  const onUpdateSellingPrice = (data: QuotationSchemaType) => {
    updateSellingPriceQuotationByProject.mutate(
      {
        project_id: props.id!,
        ...data,
      },
      {
        onSuccess: () => {
          notifications.show({
            title: "สําเร็จ",
            message: "แก้ไขราคาสําเร็จ",
            color: "green",
          });
          getQuotationByProject.refetch();
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
  };

  return (
    <>
      <div className="flex flex-col">
        <BackButton label="ย้อนกลับไปหน้ารายละเอียดโครงการ" />
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="text-xl font-bold">
              <div className="flex items-center gap-2">
                ใบเสนอราคา{" "}
                <Badge variant="dot">
                  {
                    getQuotationStatusMap(
                      getQuotationByProject.data?.data.status ?? "",
                    )?.label
                  }
                </Badge>
              </div>
            </div>
            <Text size="md" fw={700}>
              {getProjectApi.data?.data.name}
            </Text>
          </div>
          <div className="flex items-center gap-2">
            {isDisable ? (
              <a
                target="_blank"
                href={`/api/report/quotation/${props.id}?user_id=${session?.user.id}`}
              >
                <Button
                  variant="default"
                  leftSection={<IconFileText size={15} />}
                >
                  Export
                </Button>
              </a>
            ) : (
              <Button
                disabled
                variant="default"
                leftSection={<IconFileText size={15} />}
              >
                Export
              </Button>
            )}
            <Button disabled={isDisable} onClick={onChangeStatus}>
              เปลี่ยนสถานะ
            </Button>
          </div>
        </div>
        <QuotationForm
          project_id={props.id!}
          type="edit"
          onFinish={onUpdateSellingPrice}
        />
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
