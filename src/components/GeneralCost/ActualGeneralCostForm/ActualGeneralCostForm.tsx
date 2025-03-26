import ControlledInputNumber from "@/components/Controlled/ControlledInputNumber";
import {
  actualGeneralCostSchema,
  type ActualGeneralCostSchemaType,
} from "@/schemas/generalCost/actualGeneralCost.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge, Button } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  type: "create" | "edit";
  onFinish?: (data: ActualGeneralCostSchemaType) => void;
  data?: ActualGeneralCostSchemaType;
}

export default function ActualGeneralCostForm(props: Props) {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ActualGeneralCostSchemaType>({
    resolver: zodResolver(actualGeneralCostSchema),
  });

  const onFinish = (data: ActualGeneralCostSchemaType) => {
    console.log(data);
    props.onFinish?.(data);
  };

  useEffect(() => {
    if (props.data) {
      setValue("g_id", props.data.g_id);
      setValue("type_name", props.data.type_name);
      setValue("actual_cost", props.data.actual_cost);
    }
  }, [props.data, setValue]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
      <Badge variant="light">{watch("type_name")}</Badge>
      <ControlledInputNumber
        control={control}
        name="actual_cost"
        props={{
          label: "ค่าใช้จ่ายจริง",
          placeholder: "กรอกค่าใช้จ่ายจริง",
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
