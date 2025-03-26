import {
    type FieldValues,
    type Path,
    type Control,
    Controller,
  } from "react-hook-form";
  import {
    DatePickerInput,
    type DatePickerInputProps,
    DatesProvider,
    type DatesRangeValue,
    type DateValue,
  } from "@mantine/dates";
  import "dayjs/locale/th";
  import { IconCalendar } from "@tabler/icons-react";
  
  interface ControlledDatePickerProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    props?: DatePickerInputProps;
  }
  
  const ControlledDatePicker = <T extends FieldValues>(
    props: ControlledDatePickerProps<T>,
  ) => {
    return (
      <Controller
        rules={{ required: true }}
        name={props.name}
        control={props.control}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          const handleOnChange = (date: DateValue | DatesRangeValue | Date[]) => {
            onChange(date);
          };
          return (
            <DatesProvider
              settings={{
                locale: "th",
                timezone: "Asia/Bangkok",
              }}
            >
              <DatePickerInput
                valueFormat="วันddddที่ DD MMMM YYYY"
                error={error ? error.message : undefined}
                {...props.props}
                value={value}
                onChange={handleOnChange}
                leftSection={<IconCalendar size={15} />}
              />
            </DatesProvider>
          );
        }}
      />
    );
  };
  
  export default ControlledDatePicker;
  