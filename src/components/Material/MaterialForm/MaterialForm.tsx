import ControlledInputText from "@/components/Controlled/ControlledInputText";
import {
  materialSchema,
  type MaterialSchemaType,
} from "@/schemas/material/material.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  type: "create" | "edit";
  onFinish?: (data: MaterialSchemaType) => void;
  data?: MaterialSchemaType;
}

export default function MaterialForm(props: Props) {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<MaterialSchemaType>({
    resolver: zodResolver(materialSchema),
  });

  const onFinish = (data: MaterialSchemaType) => {
    console.log(data);
    props.onFinish?.(data);
  };

  useEffect(() => {
    if (props.data) {
      setValue("name", props.data.name);
      setValue("unit", props.data.unit);
    }
  }, [props.data, setValue]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
      <ControlledInputText
        control={control}
        name="name"
        props={{
          label: "ชื่อวัสดุ",
          placeholder: "กรอกชื่อวัสดุ",
          withAsterisk: true,
        }}
      />
      <ControlledInputText
        control={control}
        name="unit"
        props={{
          label: "หน่วยของวัสดุ",
          placeholder: "กรอกหน่วยของวัสดุ",
          withAsterisk: true,
          description: "หน่วยของวัสดุ เช่น กิโลกรัม, ลิตร",
        }}
      />
      <Button type="submit">
        {props.type === "create" ? "บันทึก" : "บันทึก"}
      </Button>
    </form>
  );
}
