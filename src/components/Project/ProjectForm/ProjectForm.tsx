import BackButton from "@/components/BackButton/BackButton";
import ControlledInputText from "@/components/Controlled/ControlledInputText";
import ControlledInputTextarea from "@/components/Controlled/ControlledInputTextarea";
import ControlledSelect from "@/components/Controlled/ControlledSelect";
import ControlledThailandAddress from "@/components/Controlled/ControlledThailandAddress/ControlledThailandAddress";
import useGetClients from "@/hooks/queries/client/useGetClients";
import { type AddressSchemaType } from "@/schemas/address.schema";
import {
  projectSchema,
  type ProjectSchemaType,
} from "@/schemas/project/project.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";
import { useEffect } from "react";
import { type Control, useForm } from "react-hook-form";

interface Props {
  type: "create" | "edit";
  onFinish?: (data: ProjectSchemaType) => void;
  data?: ProjectSchemaType;
}

export default function ProjectForm(props: Props) {
  const getClientsApi = useGetClients();
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectSchemaType>({
    resolver: zodResolver(projectSchema),
  });

  const onFinish = (data: ProjectSchemaType) => {
    props.onFinish?.(data);
  };

  useEffect(() => {
    if (props.data) {
      setValue("project_name", props.data.project_name);
      setValue("client_id", props.data.client_id);
      setValue("project_details", props.data.project_details);
      setValue("address", props.data.address);
      setValue("district", props.data.district);
      setValue("province", props.data.province);
      setValue("postal_code", props.data.postal_code);
      setValue("subdistrict", props.data.subdistrict);
    }
  }, [props.data, setValue]);

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onFinish)}>
      <div className="flex items-baseline gap-3">
        <ControlledInputText
          control={control}
          name="project_name"
          props={{
            label: "ชื่อโครงการ",
            placeholder: "กรอกชื่อโครงการ",
            withAsterisk: true,
            className: "w-full",
          }}
        />
        <ControlledSelect
          control={control}
          name="client_id"
          props={{
            label: "ลูกค้า",
            placeholder: "กรุณาเลือกลูกค้า",
            data: getClientsApi.data?.data.clients?.map((client) => ({
              label: client.name,
              value: client.id,
            })) ?? [],
            searchable: true,
            withAsterisk: true,
            className: "w-full",
          }}
        />
      </div>
      <ControlledInputTextarea
        control={control}
        name="project_details"
        props={{
          label: "รายละเอียดโครงการ",
          placeholder: "กรอกรายละเอียดโครงการ",
          withAsterisk: true,
        }}
      />
      <ControlledThailandAddress
        control={control as unknown as Control<AddressSchemaType>}
      />
      {props.type === "create" ? (
        <Button type="submit">สร้าง</Button>
      ) : (
        <Button type="submit">บันทึก</Button>
      )}
    </form>
  );
}
