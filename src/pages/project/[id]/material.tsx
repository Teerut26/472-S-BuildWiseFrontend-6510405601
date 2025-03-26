import BackButton from "@/components/BackButton/BackButton";
import MaterialProjectActualPriceForm from "@/components/Project/MaterialProject/MaterialProjectActualPriceForm/MaterialProjectActualPriceForm";
import MaterialProjectEstimatePriceForm from "@/components/Project/MaterialProject/MaterialProjectEstimatePriceForm/MaterialProjectEstimatePriceForm";
import useUpdateMaterialActualProject from "@/hooks/mutates/project/MaterialProject/useUpdateActualEstimateProject";
import useUpdateMaterialEstimateProject from "@/hooks/mutates/project/MaterialProject/useUpdateMaterialEstimateProject";
import useGetBoqFromProject from "@/hooks/queries/boq/useGetBoqFromProject";
import useGetMaterialsProject from "@/hooks/queries/project/MaterialProject/useGetMaterialsProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import { type MaterialProjectActualSchemaType } from "@/schemas/project/materialProject/material-project-actual-price.schama";
import { type MaterialProjectEstimateSchemaType } from "@/schemas/project/materialProject/material-project-estimate-price.schama";
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

export default function Material(
    props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
    const getProject = useGetProject({
        id: props.id ?? "",
    });
    const getMaterialsProject = useGetMaterialsProject({
        project_id: props.id ?? "",
    });
    const getBoqFromProject = useGetBoqFromProject({
        project_id: props.id ?? "",
    });
    const getQuotationByProject = useGetQuotationByProject({
        project_id: props.id ?? "",
    });
    const updateMaterialEstimateProject = useUpdateMaterialEstimateProject();
    const updateMaterialActualProject = useUpdateMaterialActualProject();

    const onEditEstimate = (data: MaterialProjectEstimateSchemaType) => {
        updateMaterialEstimateProject.mutate(
            {
                boq_id: getBoqFromProject.data?.data.id!,
                estimated_price: data.estimated_price!,
                material_id: data.material_id,
            },
            {
                onSuccess: () => {
                    notifications.show({
                        title: "สําเร็จ",
                        message: "แก้ไขราคาประเมินต่อหน่วยสําเร็จ",
                        color: "green",
                    });
                    closeEditMaterialEstimated();
                    getMaterialsProject.refetch();
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

    const onEditActual = (data: MaterialProjectActualSchemaType) => {
        updateMaterialActualProject.mutate(
            {
                boq_id: getBoqFromProject.data?.data.id!,
                ...data,
            },
            {
                onSuccess: () => {
                    notifications.show({
                        title: "สําเร็จ",
                        message: "แก้ไขราคาซื้อจริงต่อหน่วยสําเร็จ",
                        color: "green",
                    });
                    closeEditMaterialActual();
                    getMaterialsProject.refetch();
                },
            },
        );
    };

    const [EditMaterialEstimatedProject, setEditMaterialEstimatedProject] =
        useState<MaterialProjectEstimateSchemaType>();
    const [EditMaterialActualProject, setEditMaterialActualProject] =
        useState<MaterialProjectActualSchemaType>();

    const [
        openedEditMaterialEstimated,
        { open: openEditMaterialEstimated, close: closeEditMaterialEstimated },
    ] = useDisclosure(false);

    const [
        openedEditMaterialActual,
        { open: openEditMaterialActual, close: closeEditMaterialActual },
    ] = useDisclosure(false);

    const isEstimatedPriceValid = () => {
        if (getBoqFromProject.data?.data.status !== "draft") {
            return false;
        }
        return true;
    };

    const isActualPriceValid = () => {
        if (getBoqFromProject.data?.data.status !== "approved") {
            return false;
        }
        if (getQuotationByProject.data?.data.status !== "approved") {
            return false;
        }
        if (getProject.data?.data.status === "completed") {
            return false;
        }
        return true;
    };

    return (
        <>
            <Modal
                opened={openedEditMaterialEstimated}
                onClose={closeEditMaterialEstimated}
                title="แก้ไขราคาประเมินต่อหน่วย"
            >
                <MaterialProjectEstimatePriceForm
                    project_id={props.id!}
                    type="edit"
                    data={EditMaterialEstimatedProject}
                    onFinish={onEditEstimate}
                />
            </Modal>
            <Modal
                opened={openedEditMaterialActual}
                onClose={closeEditMaterialActual}
                title="แก้ไขราคาซื้อจริงต่อหน่วย"
            >
                <MaterialProjectActualPriceForm
                    project_id={props.id!}
                    type="edit"
                    data={EditMaterialActualProject}
                    onFinish={onEditActual}
                />
            </Modal>
            <div className="flex flex-col">
                <BackButton label="ย้อนกลับไปหน้ารายละเอียดโครงการ" />
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <Text size="xl" fw={700}>
                            วัสดุ
                        </Text>
                        <Text size="md" fw={700}>
                            {getProject.data?.data.name}
                        </Text>
                    </div>
                </div>
                <DataTable
                    records={getMaterialsProject.data?.data.materials ?? []}
                    columns={[
                        {
                            accessor: "name",
                            title: "วัสดุ",
                        },
                        {
                            accessor: "total_quantity",
                            title: "จำนวนรวม",
                            render: (value) => (
                                <Text>
                                    <NumberFormatter value={value.total_quantity.toFixed(2)} thousandSeparator />
                                </Text>
                            ),
                        },
                        {
                            accessor: "unit",
                            title: "หน่วย",
                            render: (value) => (
                                <Text>{value.unit}</Text>
                            ),
                        },
                        {
                            accessor: "estimated_price",
                            title: "ราคาประเมินต่อหน่วย",
                            render: (value) => (
                                <div className="flex items-center gap-1">
                                    <Text>
                                        <NumberFormatter value={value.estimated_price.toFixed(2)} thousandSeparator />
                                    </Text>
                                    {isEstimatedPriceValid() && (
                                        <ActionIcon
                                            variant="transparent"
                                            onClick={() => {
                                                setEditMaterialEstimatedProject(value);
                                                openEditMaterialEstimated();
                                            }}
                                        >
                                            <IconPencil size={15} />
                                        </ActionIcon>
                                    )}
                                </div>
                            ),
                        },
                        {
                            accessor: "avg_actual_price",
                            title: "ราคาอ้างอิงต่อหน่วย",
                            render: (value) => (
                                <Text>
                                    <NumberFormatter value={value.avg_actual_price.toFixed(2)} thousandSeparator />
                                </Text>
                            ),
                        },
                        {
                            accessor: "actual_price",
                            title: "ราคาซื้อจริงต่อหน่วย",
                            render: (value) => (
                                <div className="flex items-center gap-1">
                                    <Text>
                                        <NumberFormatter value={value.actual_price.toFixed(2)} thousandSeparator />
                                    </Text>
                                    {isActualPriceValid() && (
                                        <ActionIcon
                                            onClick={() => {
                                                setEditMaterialActualProject(value);
                                                openEditMaterialActual();
                                            }}
                                            variant="transparent"
                                        >
                                            <IconPencil size={15} />
                                        </ActionIcon>
                                    )}
                                </div>
                            ),
                        },
                        {
                            accessor: "supplier_name",
                            title: "ซัพพลายเออร์",
                        },
                        {
                            accessor: "total_estimated_price",
                            title: "ราคาประเมินรวม",
                            render: (value) => (
                                // <Text>{value.estimated_price * value.total_quantity}</Text>
                                <Text>
                                    <NumberFormatter value={(value.estimated_price * value.total_quantity).toFixed(2)} thousandSeparator />
                                </Text>
                            ),
                        },
                        {
                            accessor: "total_actual_price",
                            title: "ราคาจริงรวม",
                            render: (value) => (
                                // <Text>{value.actual_price * value.total_quantity}</Text>
                                <Text>
                                    <NumberFormatter value={(value.actual_price * value.total_quantity).toFixed(2)} thousandSeparator />
                                </Text>
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
