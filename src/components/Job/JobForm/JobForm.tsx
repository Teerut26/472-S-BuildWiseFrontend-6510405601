import ControlledInputText from "@/components/Controlled/ControlledInputText";
import ControlledInputTextarea from "@/components/Controlled/ControlledInputTextarea";
import { jobSchema, type JobSchemaType } from "@/schemas/job/job.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  type: "create" | "edit";
  onFinish?: (data: JobSchemaType) => void;
  data?: JobSchemaType;
}

export default function JobForm(props: Props) {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<JobSchemaType>({
    resolver: zodResolver(jobSchema),
  });

  const onFinish = (data: JobSchemaType) => {
    console.log(data);
    props.onFinish?.(data);
  };

  useEffect(() => {
    if (props.data) {
      setValue("name", props.data.name);
      setValue("description", props.data.description);
      setValue("unit", props.data.unit);
    }
  }, [props.data, setValue]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
      <ControlledInputText
        control={control}
        name="name"
        props={{
          label: "ชื่องาน",
          placeholder: "กรอกชื่องาน",
          withAsterisk: true,
        }}
      />
      <ControlledInputTextarea
        control={control}
        name="description"
        props={{
          label: "รายละเอียดงาน",
          placeholder: "กรอกรายละเอียดงาน",
          withAsterisk: true,
        }}
      />
      <ControlledInputText
        control={control}
        name="unit"
        props={{
          label: "หน่วยของงาน",
          placeholder: "กรอกหน่วยของงาน",
          withAsterisk: true,
        }}
      />
      {/* <div className="flex flex-col">
        <InputLabel>เลือกวัสดุ</InputLabel>
        <div className="flex flex-col gap-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <ControlledSelect
                control={control}
                name={`material.${index}.material_id`}
                props={{
                  placeholder: "เลือกวัสดุ",
                  data: [
                    {
                      value: "material_1",
                      label: "วัสดุทดสอบ 1",
                    },
                  ],
                  searchable: true,
                  className: "w-full",
                }}
              />
              <ControlledInputNumber
                control={control}
                name={`material.${index}.quantity`}
                props={{
                  placeholder: "จำนวน",
                  withAsterisk: true,
                }}
              />
              <div>
                <Button
                  onClick={() => remove(index)}
                  variant="outline"
                  color="red"
                >
                  ลบ
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-center">
          <Button
            variant="outline"
            onClick={() =>
              append({
                material_id: "",
                quantity: 0,
              })
            }
            leftSection={<IconPlus />}
          >
            เพิ่มรายการวัสดุ
          </Button>
        </div>
      </div> */}
      {props.type === "create" ? (
        <Button type="submit">บันทึก</Button>
      ) : (
        <Button type="submit">บันทึก</Button>
      )}
    </form>
  );
}
