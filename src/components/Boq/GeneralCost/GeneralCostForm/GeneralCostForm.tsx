import ControlledInputNumber from "@/components/Controlled/ControlledInputNumber";
import {
  boqGeneralCostSchema,
  type BoqGeneralCostSchemaType,
} from "@/schemas/boq/boq-general-cost.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, Button } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  type: "create" | "edit";
  onFinish?: (data: BoqGeneralCostSchemaType) => void;
  data?: BoqGeneralCostSchemaType;
}

export default function GeneralCostForm(props: Props) {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<BoqGeneralCostSchemaType>({
    resolver: zodResolver(boqGeneralCostSchema),
  });

  const onFinish = (data: BoqGeneralCostSchemaType) => {
    console.log(data);
    props.onFinish?.(data);
  };

  useEffect(() => {
    if (props.data) {
      setValue("g_id", props.data.g_id);
      setValue("type_name", props.data.type_name);
      setValue("estimated_cost", props.data.estimated_cost);
    }
  }, [props.data, setValue]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
      <Badge variant="light">{watch("type_name")}</Badge>
      <ControlledInputNumber
        control={control}
        name="estimated_cost"
        props={{
          label: "ราคาประเมิน",
          placeholder: "กรอกราคาประเมิน",
          withAsterisk: true,
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
