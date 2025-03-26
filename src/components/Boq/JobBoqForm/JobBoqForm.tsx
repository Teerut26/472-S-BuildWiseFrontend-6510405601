import ControlledInputNumber from "@/components/Controlled/ControlledInputNumber";
import ControlledSelect from "@/components/Controlled/ControlledSelect";
import useGetJobs from "@/hooks/queries/job/useGetJobs";
import {
  jobBoqSchema,
  type JobBoqSchemaType,
} from "@/schemas/boq/jobboq.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  type: "create" | "edit";
  onFinish?: (data: JobBoqSchemaType) => void;
  data?: JobBoqSchemaType;
}

export default function JobBoqForm(props: Props) {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<JobBoqSchemaType>({
    resolver: zodResolver(jobBoqSchema),
  });

  const getJobs = useGetJobs();

  const onFinish = (data: JobBoqSchemaType) => {
    console.log(data);
    props.onFinish?.(data);
  };

  useEffect(() => {
    if (props.data) {
      setValue("job_id", props.data.job_id);
      setValue("quantity", props.data.quantity);
      setValue("labor_cost", props.data.labor_cost);
    }
  }, [props.data, setValue]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
      <ControlledSelect
        control={control}
        name="job_id"
        props={{
          label: "งาน",
          placeholder: "เลือกงาน",
          withAsterisk: true,
          data: getJobs.data?.data.jobs.map((job) => ({
            value: job.job_id,
            label: job.name,
          })),
          searchable: true,
        }}
      />
      <ControlledInputNumber
        control={control}
        name="quantity"
        props={{
          label: "จํานวน",
          placeholder: "กรอกจำนวน",
          withAsterisk: true,
          thousandSeparator: true,
        }}
      />
      <ControlledInputNumber
        control={control}
        name="labor_cost"
        props={{
          label: "ค่าแรง",
          placeholder: "กรอกค่าแรง",
          withAsterisk: true,
          thousandSeparator: true,
        }}
      />
      {props.type === "create" ? (
        <Button type="submit">บันทึก</Button>
      ) : (
        <Button type="submit">บันทึก</Button>
      )}
    </form>
  );
}
