import ControlledInputNumber from "@/components/Controlled/ControlledInputNumber";
import ControlledInputText from "@/components/Controlled/ControlledInputText";
import ControlledSelect from "@/components/Controlled/ControlledSelect";
import useGetBoqFromProject from "@/hooks/queries/boq/useGetBoqFromProject";
import useGetProject from "@/hooks/queries/project/useGetProject";
import useGetQuotationByProject from "@/hooks/queries/quotation/useGetQuotationByProject";
import useGetSuppliers from "@/hooks/queries/supplier/useGetSuppliers";
import {
  materialProjectActualSchema,
  type MaterialProjectActualSchemaType,
} from "@/schemas/project/materialProject/material-project-actual-price.schama";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Text } from "@mantine/core";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Props {
  type: "create" | "edit";
  onFinish?: (data: MaterialProjectActualSchemaType) => void;
  data?: MaterialProjectActualSchemaType;
  project_id: string;
}

export default function MaterialProjectActualPriceForm(props: Props) {
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
  } = useForm<MaterialProjectActualSchemaType>({
    resolver: zodResolver(materialProjectActualSchema),
  });

  const onFinish = (data: MaterialProjectActualSchemaType) => {
    console.log(data);
    props.onFinish?.(data);
  };

  useEffect(() => {
    if (props.data) {
      setValue("name", props.data.name);
      setValue("supplier_id", props.data.supplier_id);
      setValue("material_id", props.data.material_id);
      setValue("actual_price", props.data.actual_price);
    }
  }, [props.data, setValue]);

  const isActualPriceValid = () => {
    if (getBoqFromProject.data?.data.status !== "approved") {
      return false;
    }
    if (getQuotationByProject.data?.data.status !== "approved") {
      return false;
    }
    if (getProject.data?.data.status === "completed") {
      return false;
    }
    return true;
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
      <Text fw={700}>{props.data?.name}</Text>
      <ControlledSelect
        control={control}
        name="supplier_id"
        props={{
          label: "ซัพพลายเออร์",
          placeholder: "เลือกซัพพลายเออร์",
          withAsterisk: true,
          data:
            getSuppliers.data?.data.suppliers?.map((item) => ({
              value: item.id,
              label: item.name,
            })) ?? [],
          searchable: true,
          disabled: !isActualPriceValid(),
        }}
      />
      <ControlledInputNumber
        control={control}
        name="actual_price"
        props={{
          label: "ราคาซื้อจริง",
          placeholder: "กรอกราคาซื้อจริง",
          withAsterisk: true,
          thousandSeparator: true,
        }}
      />
      <Button type="submit">
        {props.type === "create" ? "บันทึก" : "บันทึก"}
      </Button>
    </form>
  );
}
