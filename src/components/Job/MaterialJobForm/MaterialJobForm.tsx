import ControlledInputNumber from "@/components/Controlled/ControlledInputNumber";
import ControlledSelect from "@/components/Controlled/ControlledSelect";
import useGetMaterials from "@/hooks/queries/material/useGetMaterials";
import {
  materialJobSchema,
  type MaterialJobSchemaType,
} from "@/schemas/job/job.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  type: "create" | "edit";
  onFinish?: (data: MaterialJobSchemaType) => void;
  data?: MaterialJobSchemaType;
}

export default function MaterialJobForm(props: Props) {
  const getMaterials = useGetMaterials();
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<MaterialJobSchemaType>({
    resolver: zodResolver(materialJobSchema),
  });

  const onFinish = (data: MaterialJobSchemaType) => {
    console.log(data);
    props.onFinish?.(data);
  };

  useEffect(() => {
    if (props.data) {
      setValue("material_id", props.data.material_id);
      setValue("quantity", props.data.quantity);
    }
  }, [props.data, setValue]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
      <ControlledSelect
        control={control}
        name="material_id"
        props={{
          disabled: props.type === "edit",
          label: "วัสดุ",
          withAsterisk: true,
          placeholder: "เลือกวัสดุ",
          data: getMaterials.data?.data.materials.map((material) => ({
            value: material.material_id,
            label: material.name,
          })),
          searchable: true,
        }}
      />
      <ControlledInputNumber
        control={control}
        name="quantity"
        props={{
          label: "จํานวน",
          placeholder: "กรอกจํานวน",
          withAsterisk: true,
        }}
      />
      {props.type === "create" ? (
        <Button type="submit">ยืนยัน</Button>
      ) : (
        <Button type="submit">บันทึก</Button>
      )}
    </form>
  );
}
