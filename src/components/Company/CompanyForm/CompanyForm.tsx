import ControlledInputText from "@/components/Controlled/ControlledInputText";
import ControlledThailandAddress from "@/components/Controlled/ControlledThailandAddress/ControlledThailandAddress";
import { type AddressSchemaType } from "@/schemas/address.schema";
import {
  companySchema,
  type CompanySchemaType,
} from "@/schemas/company/company.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";
import { useEffect } from "react";
import { type Control, useForm } from "react-hook-form";

interface Props {
  type: "create" | "edit";
  onFinish?: (data: CompanySchemaType) => void;
  data?: CompanySchemaType;
}

export default function CompanyForm(props: Props) {
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanySchemaType>({
    resolver: zodResolver(companySchema),
  });

  const onFinish = (data: CompanySchemaType) => {
    console.log(data);
    props.onFinish?.(data);
  };

  useEffect(() => {
    if (props.data) {
      setValue("name", props.data.name);
      setValue("email", props.data.email);
      setValue("tel", props.data.tel);
      setValue("address", props.data.address);
      setValue("district", props.data.district);
      setValue("subdistrict", props.data.subdistrict);
      setValue("province", props.data.province);
      setValue("postal_code", props.data.postal_code);
      setValue("tax_id", props.data.tax_id);
    }
  }, [props.data, setValue]);

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onFinish)}>
      <div className="flex gap-2">
        <ControlledInputText
          control={control}
          name="name"
          props={{
            label: "ชื่อบริษัท",
            placeholder: "กรอกชื่อบริษัท",
            withAsterisk: true,
          }}
        />
        <ControlledInputText
          control={control}
          name="email"
          props={{
            label: "Email",
            placeholder: "กรอก Emal",
            withAsterisk: true,
          }}
        />
      </div>
      <div className="flex gap-2">
        <ControlledInputText
          control={control}
          name="tax_id"
          props={{
            label: "เลขประจําตัวผู้เสียภาษี",
            placeholder: "กรอกเลขประจําตัวผู้เสียภาษี",
            withAsterisk: true,
          }}
        />
        <ControlledInputText
          control={control}
          name="tel"
          props={{
            label: "เบอร์ติดต่อ",
            placeholder: "กรอกเบอร์ติดต่อ",
            withAsterisk: true,
          }}
        />
      </div>

      <ControlledThailandAddress
        control={control as unknown as Control<AddressSchemaType>}
      />

      <Button type="submit">
        {props.type === "create" ? "บันทึก" : "บันทึก"}
      </Button>
    </form>
  );
}
