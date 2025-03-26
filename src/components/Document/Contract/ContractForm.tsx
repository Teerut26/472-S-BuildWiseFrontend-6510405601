import ControlledDatePicker from "@/components/Controlled/ControlledDatePicker";
import ControlledInputNumber from "@/components/Controlled/ControlledInputNumber";
import ControlledInputText from "@/components/Controlled/ControlledInputText";
import ControlledInputTextarea from "@/components/Controlled/ControlledInputTextarea";
import { contractSchema, type ContractSchemaType } from "@/schemas/document/contract/contract.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActionIcon, Alert, Button, Group, Input, List, Notification, NumberFormatter, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconBriefcase, IconCircleCheck, IconCircleDashed, IconEqual, IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import PeriodForm from "./PeriodForm/PeriodForm";
import useGetJobsByProjectID from "@/hooks/queries/job/useGetJobsByProjectID";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import _ from "lodash";
import clsx from "clsx";
import { Notifications } from "@mantine/notifications";

interface Props {
    type: "create" | "edit";
    onFinish?: (data: ContractSchemaType) => void;
    data?: ContractSchemaType;
    project_id: string
}

export default function ContractForm(props: Props) {
    const getJobsByProjectID = useGetJobsByProjectID({ project_id: props.project_id });

    const getQuotationByProject = useGetQuotationByProject({
        project_id: props.project_id,
    });

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

    const {
        control,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<ContractSchemaType>({
        resolver: zodResolver(contractSchema),
    });

    const periods = useWatch({
        control,
        name: "periods",
    })

    const attachmentsFields = useFieldArray({
        name: "format",
        control,
    })

    const periodsFields = useFieldArray({
        name: "periods",
        control,
    })

    const periodTotalPrice = () => {
        return _.sumBy(periods, o => o.amount_period);
    }

    const onFinish = (data: ContractSchemaType) => {
        if (periodTotalPrice() !== FinalPrice()) {
            return Notifications.show({
                title: "Error",
                message: "Period total price does not match final price",
                color: "red",
            })
        }
        props.onFinish?.(data);
    };

    useEffect(() => {
        if (props.data) {
            setValue("project_description", props.data.project_description);
            setValue("area_size", props.data.area_size);
            setValue("format", props.data.format);
            setValue("periods", props.data.periods);
            setValue("start_date", props.data.start_date);
            setValue("end_date", props.data.end_date);
            setValue("validate_within", props.data.validate_within);
            setValue("pay_within", props.data.pay_within);
            setValue("retention_money", props.data.retention_money);
            setValue("guarantee_within", props.data.guarantee_within);
            setValue("amendment", props.data.amendment);
            setValue("termination_of_contract", props.data.termination_of_contract);
            setValue("end_of_contract", props.data.end_of_contract);
            setValue("breach_of_contract", props.data.breach_of_contract);
            setValue("force_majeure", props.data.force_majeure);
            setValue("project_id", props.data.project_id);
            setValue("contract_id", props.data.contract_id);
        }
    }, [props.data]);


    return (
        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
            <ControlledInputTextarea
                control={control}
                name="project_description"
                props={{
                    label: "ลักษณะงาน",
                    placeholder: "กรอกลักษณะงาน",
                    withAsterisk: true,
                }}
            />
            <ControlledInputNumber
                control={control}
                name="area_size"
                props={{
                    label: "เนื้อที่",
                    placeholder: "กรอกเนื้อที่",
                    withAsterisk: true,
                    thousandSeparator: true,
                    rightSection: "ตร.ม.",
                    rightSectionWidth: 50,
                    description: "กรุณากรอกขนาดพื้นที่",
                }}
            />
            <div className="flex flex-col gap-2 ">
                <Input.Wrapper withAsterisk label="รูปแบบและรายการแนบท้ายสัญญา" />
                {attachmentsFields.fields?.map((field, index) => (
                    <div key={field.id} className="flex gap-3 items-center">
                        <ControlledInputText
                            control={control}
                            name={`format.${index}.value`}
                            props={{
                                placeholder: "กรอกรูปแบบและรายการแนบท้ายสัญญา",
                                withAsterisk: true,
                                leftSection: `${index + 1}.`,
                            }}
                        />
                        <ActionIcon color="red" variant="light" onClick={() => attachmentsFields.remove(index)}>
                            <IconTrash size={20} />
                        </ActionIcon>
                    </div>
                ))}
                <div className="flex">
                    <ActionIcon variant="light" onClick={() => attachmentsFields.append({ value: "" })}>
                        <IconPlus size={20} />
                    </ActionIcon>
                </div>
            </div>
            <div className="flex flex-col gap-2 ">
                <Input.Wrapper withAsterisk label="2. ราคา" />
                <Paper withBorder p={"sm"}>
                    <Stack>
                        <Group justify="center">
                            <Stack gap={5}>
                                <Text>ราคารวมสุทธิ</Text>
                                <NumberFormatter className="font-bold" value={(FinalPrice() ?? 0).toFixed(2)} thousandSeparator />
                            </Stack>
                            {/* <div>
                                <IconEqual className={clsx(periodTotalPrice() === FinalPrice() ? "text-green-500" : periodTotalPrice() > FinalPrice() ? "text-red-500" : "text-blue-500")} size={30} />
                            </div> */}
                            <Stack gap={5}>
                                <Text>ราคารวมของงวด</Text>
                                <NumberFormatter className="font-bold" value={(periodTotalPrice() ?? 0).toFixed(2)} thousandSeparator />
                            </Stack>
                        </Group>
                    </Stack>
                </Paper>
                <Paper withBorder p={"sm"}>
                    <List
                        spacing="xs"
                        size="sm"
                        center
                    >
                        {getJobsByProjectID.data?.data?.map((job, index) => {
                            const selectedJobs = periods?.map((period) => period.jobs).flat();
                            const selectedJob = selectedJobs?.find((selectedJob) => selectedJob?.job_id === job.job_id);
                            const remaining = job.quantity - (selectedJob?.job_amount ?? 0);

                            return (
                                <List.Item
                                    key={index}
                                    icon={
                                        <ThemeIcon color={remaining === 0 ? "green" : remaining < 0 ? "red" : "blue"} size={24} radius="xl">
                                            {remaining === 0 ? <IconCircleCheck title="งานใช้หมดแล้ว" size={16} /> : remaining < 0 ? <IconCircleDashed title="งานเกินจำนวนที่มี" size={16} /> : <IconBriefcase title="งานยังใช้ไม่หมด" size={16} />}
                                        </ThemeIcon>
                                    }
                                    component={Stack}
                                >
                                    <Text>
                                        {job.name}
                                    </Text>
                                    <Group gap={5}>
                                        <Text c="dimmed" size="sm">
                                            คงเหลือ:
                                        </Text>
                                        <NumberFormatter thousandSeparator className="text-gray-500 font-bold" value={remaining} suffix=" งาน" />
                                    </Group>
                                </List.Item>
                            )
                        })}

                    </List>
                </Paper>
                {periodsFields.fields?.map((field, index) => (
                    <Paper key={field.id} component={Stack} withBorder p={"sm"}>
                        <Group justify="space-between">
                            <Input.Wrapper withAsterisk label={`งวดที่ ${index + 1}`} />
                            <ActionIcon variant="light" color="red" onClick={() => periodsFields.remove(index)}>
                                <IconTrash size={20} />
                            </ActionIcon>
                        </Group>
                        <div key={field.id} className="flex gap-3 items-center">
                            <ControlledInputNumber
                                key={`${field.id}-amount`}
                                control={control}
                                name={`periods.${index}.amount_period`}
                                props={{
                                    label: `${index + 1}. จำนวนเงิน`,
                                    withAsterisk: true,
                                    className: "w-full",
                                    thousandSeparator: true,
                                }}
                            />
                            <ControlledInputNumber
                                key={`${field.id}-delivered`}
                                control={control}
                                name={`periods.${index}.delivered_within`}
                                props={{
                                    label: "ส่งมอบภายในกี่วัน",
                                    placeholder: "ระบุจำนวนวัน",
                                    withAsterisk: true,
                                    className: "w-full",
                                    disabled: index === 0,
                                    rightSection: "วัน",
                                    rightSectionWidth: 30,
                                }}
                            />
                        </div>
                        {index !== 0 && <div className="flex flex-col">
                            <Input.Wrapper withAsterisk label={`เลือกงาน`} className="" />
                            {props.data?.project_id && <PeriodForm control={control} name={`periods.${index}.jobs`} project_id={props.data.project_id} />}
                        </div>}
                    </Paper>
                ))}
                <div className="flex">
                    <ActionIcon variant="light" onClick={() => periodsFields.append({ amount_period: 0, delivered_within: null, jobs: [] })}>
                        <IconPlus size={20} />
                    </ActionIcon>
                </div>
            </div>
            <div className="flex flex-col">
                <Input.Wrapper withAsterisk label="3. กำหนดเวลาแล้วเสร็จ" />
                <Group wrap="nowrap">
                    <ControlledDatePicker
                        control={control}
                        name="start_date"
                        props={{
                            label: "วันเริ่มงาน",
                            placeholder: "ระบุวันเริ่มงาน",
                            withAsterisk: true,
                            className: "w-full",
                            clearable: true,
                        }}
                    />
                    <ControlledDatePicker
                        control={control}
                        name="end_date"
                        props={{
                            label: "วันเสร็จสิ้นงาน",
                            placeholder: "ระบุวันเสร็จสิ้นงาน",
                            withAsterisk: true,
                            className: "w-full",
                            clearable: true,
                        }}
                    />
                </Group>
            </div>
            <Group wrap="nowrap">
                <ControlledInputNumber
                    control={control}
                    name="validate_within"
                    props={{
                        label: "4. ระยะเวลาในการตรวจรับมอบงาน (วัน)",
                        description: "ระบุจำนวนวันว่าให้ผู้ว่าจ้างหรือตัวแทนตรวจรับมอบงวดงานภายในกี่วัน นับตั้งแต่วันที่......",
                        placeholder: "จำนวนวัน",
                        withAsterisk: true,
                        className: "w-full"
                    }}
                />
                <ControlledInputNumber
                    control={control}
                    name="pay_within"
                    props={{
                        label: "5. กำหนดระยะเวลาการชำระเงิน (วัน)",
                        description: "ระบุจำนวนวันในการชำระเงินค่าจ้างงวดงาน นับตั้งแต่วันที่ได้ตรวจรับมอบงาน",
                        placeholder: "จำนวนวัน",
                        withAsterisk: true,
                        className: "w-full"
                    }}
                />
            </Group>
            <Group wrap="nowrap">
                <ControlledInputNumber
                    control={control}
                    name="retention_money"
                    props={{
                        label: "6. จำนวนเงินประกันผลงาน (บาท)",
                        description: "ระบุจำนวนเงินประกันผลงาน",
                        placeholder: "จำนวนเงิน",
                        withAsterisk: true,
                        thousandSeparator: true,
                        className: "w-full"
                    }}
                />
                <ControlledInputNumber
                    control={control}
                    name="guarantee_within"
                    props={{
                        label: "7. ระยะเวลารับประกันผลงาน (วัน)",
                        description: "ระบุจำนวนวันในการรับประกันผลงาน หลังจากงานแล้วเสร็จ",
                        placeholder: "จำนวนวัน",
                        withAsterisk: true,
                        className: "w-full"
                    }}
                />
            </Group>


            <ControlledInputTextarea
                control={control}
                name="amendment"
                props={{
                    label: "8. งานพิเศษและการแก้ไข เพิ่มเติม เปลี่ยนแปลงงาน นับถัดจากวันที่ได้รับมอบงานดังกล่าว",
                    description: "ระบุรายละเอียดเกี่ยวกับงานพิเศษและการแก้ไข เพิ่มเติม เปลี่ยนแปลงงาน ตามข้อตกลง",
                    placeholder: "รายละเอียดงานพิเศษและการแก้ไข เพิ่มเติม เปลี่ยนแปลงงาน",
                    withAsterisk: true,
                    className: "w-full"
                }}
            />
            <ControlledInputTextarea
                control={control}
                name="termination_of_contract"
                props={{
                    label: "9. เหตุผลในการบอกเลิกสัญญา",
                    description: "โปรดระบุเหตุผลในการบอกเลิกสัญญา",
                    placeholder: "ระบุเหตุผล...",
                    withAsterisk: true,
                    className: "w-full"
                }}
            />
            <ControlledInputTextarea
                control={control}
                name="end_of_contract"
                props={{
                    label: "10. เงื่อนไขการสิ้นสุดสัญญา",
                    description: "ระบุเงื่อนไขที่ทำให้สัญญาสิ้นสุดลง",
                    placeholder: "เช่น เมื่อครบกำหนดระยะเวลาประกันผลงาน",
                    withAsterisk: true,
                    className: "w-full"
                }}
            />
            <ControlledInputTextarea
                control={control}
                name="breach_of_contract"
                props={{
                    label: "11. การผิดสัญญา",
                    description: "ระบุเงื่อนไขและผลของการผิดสัญญา",
                    placeholder: "เช่น หากฝ่ายใดฝ่ายหนึ่งผิดสัญญาข้อใดข้อหนึ่ง",
                    withAsterisk: true,
                    className: "w-full"
                }}
            />
            <ControlledInputTextarea
                control={control}
                name="force_majeure"
                props={{
                    label: "12. เหตุสุดวิสัย",
                    description: "ระบุเหตุการณ์ที่ถือเป็นเหตุสุดวิสัยและผลกระทบต่อสัญญา",
                    placeholder: "เช่น ภัยธรรมชาติ, การระบาดของโรค",
                    withAsterisk: true,
                    className: "w-full"
                }}
            />
            <div>
                <Button type="submit">
                    {props.type === "create" ? "สร้าง" : "บันทึก"}
                </Button>
            </div>
        </form>
    );
}
