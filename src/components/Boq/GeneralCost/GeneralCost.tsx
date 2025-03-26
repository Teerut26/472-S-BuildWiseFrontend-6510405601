import { Badge, Button, Modal, NumberFormatter, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { DataTable } from "mantine-datatable";
import GeneralCostForm from "./GeneralCostForm/GeneralCostForm";
import useGetGeneralCostBoq from "@/hooks/queries/boq/GeneralCostBoq/useGetGeneralCostBoq";
import { useState } from "react";
import { type BoqGeneralCostSchemaType } from "@/schemas/boq/boq-general-cost.schema";
import { notifications } from "@mantine/notifications";
import useGetBoqFromProject from "@/hooks/queries/boq/useGetBoqFromProject";
import useUpdateEstimateGeneralCost from "@/hooks/mutates/boq/GeneralCostBoq/useUpdateEstimateGeneralCost";

interface Props {
    project_id: string;
}

export default function GeneralCost(props: Props) {
    const [opened, { open, close }] = useDisclosure(false);
    const getGeneralCostBoq = useGetGeneralCostBoq({
        project_id: props.project_id,
    });
    const updateEstimateGeneralCost = useUpdateEstimateGeneralCost();
    const getBoqFromProject = useGetBoqFromProject({
        project_id: props.project_id,
    });

    const [EditGeneralCost, setEditGeneralCost] =
        useState<BoqGeneralCostSchemaType>();

    const onEdit = (data: BoqGeneralCostSchemaType) => {
        updateEstimateGeneralCost.mutate(data, {
            onSuccess: () => {
                notifications.show({
                    title: "สําเร็จ",
                    message: "แก้ไขค่าใช้จ่ายทั่วไปสําเร็จ",
                    color: "green",
                });
                getGeneralCostBoq.refetch();
                close();
            },
        });
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="แก้ไขค่าใช้จ่ายทั่วไป">
                <GeneralCostForm onFinish={onEdit} type="edit" data={EditGeneralCost} />
            </Modal>
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <Text fw={700}>ค่าใช้จ่ายทั่วไปของ BOQ</Text>
                </div>
                <DataTable
                    records={getGeneralCostBoq.data?.data.general_costs}
                    columns={[
                        {
                            accessor: "type_name",
                            title: "ประเภท",
                            render: (record) => (
                                <Badge variant="light">{record.type_name}</Badge>
                            ),
                        },
                        {
                            accessor: "estimated_cost",
                            title: "ราคาประเมิน",
                            render: (data) => (
                                <Text>
                                    <NumberFormatter value={data.estimated_cost.toFixed(2)} thousandSeparator={true} />
                                </Text>
                            ),
                        },
                        {
                            accessor: "id",
                            title: "ดำเนินการ",
                            textAlign: "center",
                            render: (record) => (
                                <Button
                                    disabled={getBoqFromProject.data?.data.status === "approved"}
                                    onClick={() => {
                                        open();
                                        setEditGeneralCost(record);
                                    }}
                                >
                                    แก้ไขราคาประเมิน
                                </Button>
                            ),
                        },
                    ]}
                />
            </div>
        </>
    );
}
