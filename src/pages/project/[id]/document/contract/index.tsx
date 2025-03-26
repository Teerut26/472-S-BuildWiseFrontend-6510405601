/* eslint-disable @typescript-eslint/no-unsafe-argument */
import BackButton from "@/components/BackButton/BackButton";
import useGetCompanyByUser from "@/hooks/queries/company/useGetCompanyByUser";
import useGetContractByProject from "@/hooks/queries/contract/useGetContractByProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import { Badge, Box, Button, Divider, LoadingOverlay, Text } from "@mantine/core";
import { IconFileText } from "@tabler/icons-react";
import _ from "lodash";
import { type GetServerSidePropsContext, type InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ContractPdfView from "@/components/Document/Contract/ContractPdfView";
import { getContractStatusMap } from "@/utils/contractStatusMap";
import useChangeStatusContract from "@/hooks/mutates/contract/useChangeStatusContract";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";

export default function Contract(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
    const { data: session } = useSession();
    const getProject = useGetProject({ id: props.id ?? "" });
    const getCompanyByUser = useGetCompanyByUser({ user_id: session?.user?.id ?? "" });
    const getContractByProject = useGetContractByProject({ project_id: props.id ?? "" });
    const changeStatusContract = useChangeStatusContract();

    const isApproved = getContractByProject.data?.status === "approved";

    const onChnageStatus = () => {
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
                changeStatusContract.mutate(
                    {
                        project_id: props.id ?? "",
                    },
                    {
                        onSuccess: () => {
                            notifications.show({
                                title: "สําเร็จ",
                                message: "เปลี่ยนสถานะสัญญาสําเร็จ",
                                color: "green",
                            });
                            getContractByProject.refetch();
                        },
                        onError: (error) => {
                            if (error instanceof AxiosError) {
                                notifications.show({
                                    title: "เกิดข้อผิดพลาด",
                                    message: error.response?.data.message,
                                    color: "red",
                                });
                            }
                        },
                    }
                );
            },
        })
    }

    return (
        <div className="flex flex-col">
            <BackButton label="กลับไปหน้าเอกสาร" />
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <div className="text-xl font-bold">
                        <div className="flex items-center gap-2">
                            สัญญา
                            <Badge variant="dot">
                                {getContractStatusMap(getContractByProject.data?.status ?? "")?.label}
                            </Badge>
                        </div>
                    </div>
                    <Text size="md" fw={700}>
                        {getProject.data?.data.name}
                    </Text>
                </div>
                <div className="flex gap-2">
                    {isApproved ? <a
                        target="_blank"
                        href={`/api/report/document/contract/${props.id}?user_id=${session?.user.id}`}
                    >
                        <Button
                            variant="default"
                            leftSection={<IconFileText size={15} />}
                        >
                            Export
                        </Button>
                    </a> : <Button disabled>
                        Export
                    </Button>}

                    {isApproved ? <Button disabled>
                        แก้ไข
                    </Button> : <Link href={`/project/${props.id}/document/contract/edit`}>
                        <Button>
                            แก้ไข
                        </Button>
                    </Link>}
                    <Button onClick={onChnageStatus} disabled={isApproved}>
                        เปลี่ยนสถานะ
                    </Button>
                </div>
            </div>
            <Divider my={"md"} />
            <Box pos="relative">
                <LoadingOverlay visible={getContractByProject.isLoading} loaderProps={{ children: 'Loading...' }} />
                {(getContractByProject.data && getProject.data?.data && getCompanyByUser.data?.data) ? <ContractPdfView
                    isPrintMode={false}
                    data={getContractByProject.data}
                    project={getProject.data?.data}
                    company={getCompanyByUser.data?.data}
                /> : <div className="flex justify-center">
                    <Text size="xl">ไม่พบข้อมูลสัญญา</Text>
                </div>}
            </Box>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return {
        props: {
            id: context.query.id?.toString(),
        },
    };
}
