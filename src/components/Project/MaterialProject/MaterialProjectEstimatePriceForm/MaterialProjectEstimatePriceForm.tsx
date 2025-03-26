import ControlledInputNumber from "@/components/Controlled/ControlledInputNumber";
import ControlledInputText from "@/components/Controlled/ControlledInputText";
import ControlledSelect from "@/components/Controlled/ControlledSelect";
import useGetBoqFromProject from "@/hooks/queries/boq/useGetBoqFromProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import useGetSuppliers from "@/hooks/queries/supplier/useGetSuppliers";
import {
  materialProjectEstimateSchema,
  MaterialProjectEstimateSchemaType,
} from "@/schemas/project/materialProject/material-project-estimate-price.schama";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  type: "create" | "edit";
  onFinish?: (data: MaterialProjectEstimateSchemaType) => void;
  data?: MaterialProjectEstimateSchemaType;
  project_id: string;
}

export default function MaterialProjectEstimatePriceForm(props: Props) {
  const getSuppliers = useGetSuppliers();
  const getProject = useGetProject({ id: props.project_id });
  const getBoqFromProject = useGetBoqFromProject({
    project_id: props.project_id,
  });
  const getQuotationByProject = useGetQuotationByProject({
    project_id: props.project_id,
  });

  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<MaterialProjectEstimateSchemaType>({
    resolver: zodResolver(materialProjectEstimateSchema),
  });

  const onFinish = (data: MaterialProjectEstimateSchemaType) => {
    console.log(data);
    props.onFinish?.(data);
  };

  useEffect(() => {
    if (props.data) {
      setValue("material_id", props.data.material_id);
      setValue("name", props.data.name);
      setValue("estimated_price", props.data.estimated_price);
    }
  }, [props.data, setValue]);

  const isEstimatedPriceValid = () => {
    if (getBoqFromProject.data?.data.status !== "draft") {
      return false;
    }
    return true;
  };

  console.log(errors);
  

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
      <Text fw={700}>{props.data?.name}</Text>
      <ControlledInputNumber
        control={control}
        name="estimated_price"
        props={{
          label: "ราคาประเมิน",
          placeholder: "กรอกราคาประเมิน",
          withAsterisk: true,
          disabled: !isEstimatedPriceValid(),
          thousandSeparator: true,
        }}
      />
      <Button type="submit">
        {props.type === "create" ? "บันทึก" : "บันทึก"}
      </Button>
    </form>
  );
}
