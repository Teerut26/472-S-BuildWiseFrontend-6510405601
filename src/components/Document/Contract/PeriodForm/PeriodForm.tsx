import ControlledInputNumber from "@/components/Controlled/ControlledInputNumber";
import ControlledSelect from "@/components/Controlled/ControlledSelect";
import useGetJobsByProjectID from "@/hooks/queries/job/useGetJobsByProjectID";
import { type ContractSchemaType } from "@/schemas/document/contract/contract.schema"
import { ActionIcon, Group } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { type Control, type Path, useFieldArray, useFormContext } from "react-hook-form"

interface Props {
    control: Control<ContractSchemaType>
    name: string
    project_id: string
}

export default function PeriodForm(props: Props) {
    const getJobsByProjectID = useGetJobsByProjectID({ project_id: props.project_id });
    const { control } = props;
    const { fields, append, remove } = useFieldArray({
        control,
        name: props.name as unknown as never,
    });
    return (
        <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
                <div className="flex flex-col" key={field.id}>
                    <Group wrap="nowrap" align="normal">
                        <ControlledSelect
                            control={control}
                            name={`${props.name}[${index}].job_id` as unknown as Path<ContractSchemaType>}
                            props={{
                                placeholder: "เลือกงาน",
                                className: "w-full",
                                leftSection: `${index + 1}.`,
                                searchable: true,
                                data: getJobsByProjectID.data?.data?.map((job) => ({
                                    value: job.job_id,
                                    label: job.name
                                })) ?? []
                            }}
                        />
                        <ControlledInputNumber
                            control={control}
                            name={`${props.name}[${index}].job_amount` as unknown as Path<ContractSchemaType>}
                            props={{
                                placeholder: "จำนวนงาน"
                            }}
                        />
                        <ActionIcon variant="light" color="red" onClick={() => remove(index)}>
                            <IconTrash size={20} />
                        </ActionIcon>
                    </Group>
                </div>
            ))}
            <ActionIcon variant="light" onClick={() => append({
                job_id: undefined,
                job_amount: 1
            })}>
                <IconPlus size={20} />
            </ActionIcon>
        </div>
    )
}