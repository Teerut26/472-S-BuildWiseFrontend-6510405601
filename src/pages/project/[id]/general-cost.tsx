import BackButton from "@/components/BackButton/BackButton";
import ActualGeneralCostForm from "@/components/GeneralCost/ActualGeneralCostForm/ActualGeneralCostForm";
import useUpdateActualGeneralCost from "@/hooks/mutates/generalCost/useUpdateActualGeneralCost";
import useGetBoqFromProject from "@/hooks/queries/boq/useGetBoqFromProject";
import useGetGeneralCosts from "@/hooks/queries/generalCost/useGetGeneralCosts";
import useGetProject from "@/hooks/queries/project/useGetProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import { ActualGeneralCostSchemaType } from "@/schemas/generalCost/actualGeneralCost.schema";
import { ActionIcon, Modal, NumberFormatter, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPencil } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { DataTable } from "mantine-datatable";
import {
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType,
} from "next";
import { useState } from "react";
import { record } from "zod";

export default function GeneralCost(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
    const getProject = useGetProject({ id: props.id! });
    const getBoqFromProject = useGetBoqFromProject({ project_id: props.id! });
    const getQuotationByProject = useGetQuotationByProject({
        project_id: props.id!,
    });
    const [openedEdit, { open: openEdit, close: closeEdit }] =
        useDisclosure(false);
    const getGeneralCosts = useGetGeneralCosts({ project_id: props.id! });
    const updateActualGeneralCost = useUpdateActualGeneralCost();
    const [EditActualGeneralCost, setEditActualGeneralCost] =
        useState<ActualGeneralCostSchemaType>();

    const onEditActualGeneralCost = (data: ActualGeneralCostSchemaType) => {
        updateActualGeneralCost.mutate(data, {
            onSuccess: () => {
                notifications.show({
                    title: "สําเร็จ",
                    message: "แก้ไขค่าใช้จ่ายจริงสําเร็จ",
                    color: "green",
                });
                getGeneralCosts.refetch();
                closeEdit();
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
        });
    };

    const isEditActualGeneralCostValid = () => {
        return (
            getBoqFromProject.data?.data.status === "approved" &&
            getQuotationByProject.data?.data.status === "approved"
        );
    };

    return (
        <>
            <Modal
                opened={openedEdit}
                onClose={closeEdit}
                title="แก้ไขค่าใช้จ่ายจริง"
            >
                <ActualGeneralCostForm
                    type="edit"
                    data={EditActualGeneralCost}
                    onFinish={onEditActualGeneralCost}
                />
            </Modal>
            <div className="flex flex-col gap-3">
                <BackButton label="ย้อนกลับไปหน้ารายละเอียดโครงการ" />
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <div className="text-xl font-bold">
                            <div className="flex items-center gap-2">
                                ค่าใช้จ่ายทั่วไปของโครงการ
                            </div>
                        </div>
                        <Text size="md" fw={700}>
                            {getProject.data?.data.name}
                        </Text>
                    </div>
                </div>
                <DataTable
                    records={getGeneralCosts.data?.data.general_costs}
                    columns={[
                        {
                            accessor: "type_name",
                            title: "ประเภท",
                        },
                        {
                            accessor: "estimated_cost",
                            title: "ค่าใช้จ่ายประเมิน",
                            render: (record) => (
                                <Text>
                                    <NumberFormatter
                                        value={record.estimated_cost.toFixed(2)}
                                        thousandSeparator={true}
                                    />
                                </Text>
                            ),
                        },
                        {
                            accessor: "actual_cost",
                            title: "ค่าใช้จ่ายจริง",
                            render: (record) => (
                                <div className="flex items-center gap-1">
                                    {/* <Text>{record.actual_cost}</Text> */}
                                    <Text>
                                        <NumberFormatter value={record.actual_cost.toFixed(2)} thousandSeparator={true} />
                                    </Text>
                                    {isEditActualGeneralCostValid() && (
                                        <ActionIcon
                                            onClick={() => {
                                                setEditActualGeneralCost(record);
                                                openEdit();
                                            }}
                                            variant="transparent"
                                        >
                                            <IconPencil size={15} />
                                        </ActionIcon>
                                    )}
                                </div>
                            ),
                        },
                    ]}
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
