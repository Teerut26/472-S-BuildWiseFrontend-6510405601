import {
    type FieldValues,
    type Path,
    type Control,
    Controller,
  } from "react-hook-form";
  import {
    DatesProvider,
    DateTimePicker,
    type DateTimePickerProps,
    type DatesRangeValue,
    type DateValue,
  } from "@mantine/dates";
  import "dayjs/locale/th";
  
  interface ControlledDateTimePickerProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    props?: DateTimePickerProps;
  }
  
  const ControlledDateTimePicker = <T extends FieldValues>(
    props: ControlledDateTimePickerProps<T>,
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
              //   locale: "th",
              //   timezone: "Asia/Bangkok",
              }}
            >
              <DateTimePicker
                {...props.props}
              //   valueFormat="วันddddที่ DD MMMM YYYY HH:mm"
                valueFormat="DD MMMM YYYY HH:mm"
                error={error ? error.message : undefined}
                value={value}
                onChange={handleOnChange}
              />
            </DatesProvider>
          );
        }}
      />
    );
  };
  
  export default ControlledDateTimePicker;
  