import ControlledInputNumber from "@/components/Controlled/ControlledInputNumber";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import {
    quotationSchema,
    type QuotationSchemaType,
} from "@/schemas/quotation/quotation.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, NumberFormatter, Table } from "@mantine/core";
import _ from "lodash";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface Props {
    type: "create" | "edit";
    onFinish?: (data: QuotationSchemaType) => void;
    data?: QuotationSchemaType;
    project_id: string;
}

export default function QuotationForm(props: Props) {
    const {
        control,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<QuotationSchemaType>({
        resolver: zodResolver(quotationSchema),
    });

    const onFinish = (data: QuotationSchemaType) => {
        props.onFinish?.(data);
    };

    const getQuotationByProject = useGetQuotationByProject({
        project_id: props.project_id,
    });

    const { fields } = useFieldArray({
        control,
        name: "job_selling_prices",
    });

    const findJob = (job_id: string) => {
        return getQuotationByProject.data?.data.jobs?.find(
            (job) => job.id === job_id,
        );
    };

    useEffect(() => {
        setValue(
            "job_selling_prices",
            getQuotationByProject.data?.data.jobs?.map((job) => ({
                job_id: job.id,
                selling_price: job.selling_price,
            })) ?? [],
        );
        setValue(
            "tax_percentage",
            getQuotationByProject.data?.data.tax_percentage ?? 0,
        );
        setValue(
            "selling_general_cost",
            getQuotationByProject.data?.data.selling_general_cost ?? 0,
        );
        if (props.data) {
            setValue("selling_general_cost", props.data.selling_general_cost);
            setValue("tax_percentage", props.data.tax_percentage);
        }
    }, [
        getQuotationByProject.data?.data,
        getQuotationByProject.data?.data.jobs,
        props.data,
        setValue,
    ]);

    const isDisable = getQuotationByProject.data?.data.status === "approved";

    const FinalPrice = () => {
        const total_selling_price = _.sumBy(
            getQuotationByProject.data?.data.jobs,
            (o) => o.total_selling_price,
        );

        const selling_general_cost =
            getQuotationByProject.data?.data.selling_general_cost ?? 0;

        const tax_percentage = getQuotationByProject.data?.data.tax_percentage ?? 0;

        const tax_amount =
            (selling_general_cost + total_selling_price) * (tax_percentage / 100);
        const total_price = selling_general_cost + total_selling_price;

        return tax_amount + total_price;
    };

    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
            <div className="overflow-x-auto">
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th className="whitespace-nowrap">ชื่องาน</Table.Th>
                            <Table.Th className="whitespace-nowrap">จำนวนของงาน</Table.Th>
                            <Table.Th className="whitespace-nowrap">หน่วยของงาน</Table.Th>
                            <Table.Th className="whitespace-nowrap">
                                ราคาค่าแรงต่อหน่วย
                            </Table.Th>
                            <Table.Th className="whitespace-nowrap">
                                ราคาวัสดุประเมินต่อหน่วย
                            </Table.Th>
                            <Table.Th className="whitespace-nowrap">
                                ราคาประเมินรวมต่อหน่วย
                            </Table.Th>
                            <Table.Th className="whitespace-nowrap">ราคาขายต่อหน่วย</Table.Th>
                            <Table.Th className="whitespace-nowrap">ราคาประเมินรวม</Table.Th>
                            <Table.Th className="whitespace-nowrap">ราคาขายรวม</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {fields.map((field, index) => {
                            const job = findJob(field.job_id);
                            return (
                                <Table.Tr key={index}>
                                    <Table.Td className="whitespace-nowrap">{job?.name}</Table.Td>
                                    <Table.Td>
                                        <NumberFormatter value={job?.quantity.toFixed(2)} thousandSeparator />
                                    </Table.Td>
                                    <Table.Td>{job?.unit}</Table.Td>
                                    <Table.Td>
                                        <NumberFormatter value={job?.labor_cost.toFixed(2)} thousandSeparator />
                                    </Table.Td>
                                    <Table.Td>
                                        <NumberFormatter value={job?.total_material_price.toFixed(2)} thousandSeparator />
                                    </Table.Td>
                                    <Table.Td>
                                        <NumberFormatter value={job?.overall_cost.toFixed(2)} thousandSeparator />
                                    </Table.Td>
                                    <Table.Td>
                                        <ControlledInputNumber
                                            control={control}
                                            name={`job_selling_prices.${index}.selling_price`}
                                            props={{
                                                thousandSeparator: true,
                                                disabled: isDisable,
                                            }}
                                        />
                                    </Table.Td>
                                    <Table.Td>
                                        <NumberFormatter value={job?.total.toFixed(2)} thousandSeparator />
                                    </Table.Td>
                                    <Table.Td>
                                        <NumberFormatter value={job?.total_selling_price.toFixed(2)} thousandSeparator />
                                    </Table.Td>
                                </Table.Tr>
                            );
                        })}
                    </Table.Tbody>
                </Table>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
                <Card withBorder className="col-span-2 h-full w-full">
                    <div className="flex flex-col gap-5">
                        <div className="flex gap-2">
                            <ControlledInputNumber
                                control={control}
                                name="selling_general_cost"
                                props={{
                                    thousandSeparator: true,
                                    label: "ราคาขายค่าใช้จ่ายทั่วไป",
                                    placeholder: "กรอกราคาขายค่าใช้จ่ายทั่วไป",
                                    disabled: isDisable,
                                }}
                            />
                            <ControlledInputNumber
                                control={control}
                                name="tax_percentage"
                                props={{
                                    thousandSeparator: true,
                                    label: "ภาษี",
                                    placeholder: "กรอกภาษี",
                                    disabled: isDisable,
                                }}
                            />
                        </div>
                    </div>
                </Card>
                <Card withBorder className="flex h-full items-end">
                    <div className="flex gap-5">
                        <div className="flex justify-end">
                            <div className="flex flex-col items-end font-bold">
                                <div>ราคารวมค่าใช้จ่าย</div>
                                <div>ภาษี ({watch("tax_percentage")}%)</div>
                                <div>ราคารวมภาษี</div>
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <div className="flex flex-col">
                                <div>
                                    <NumberFormatter
                                        value={((_.sumBy(
                                            getQuotationByProject.data?.data.jobs,
                                            "total_selling_price",
                                        )) + (getQuotationByProject.data?.data.selling_general_cost ?? 0)).toFixed(2)}
                                        thousandSeparator
                                    />
                                </div>
                                <div>
                                    <NumberFormatter
                                        value={(
                                            (_.sumBy(
                                                getQuotationByProject.data?.data.jobs,
                                                "total_selling_price",
                                            ) +
                                                (getQuotationByProject.data?.data
                                                    .selling_general_cost ?? 0)) *
                                            (watch("tax_percentage") / 100)
                                        ).toFixed(2)}
                                        thousandSeparator
                                    />
                                </div>
                                <div>
                                    <NumberFormatter
                                        value={FinalPrice().toFixed(2)}
                                        thousandSeparator
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            {props.type === "create" ? (
                <Button type="submit">บันทึก</Button>
            ) : (
                <Button disabled={isDisable} type="submit">
                    บันทึก
                </Button>
            )}
        </form>
    );
}
