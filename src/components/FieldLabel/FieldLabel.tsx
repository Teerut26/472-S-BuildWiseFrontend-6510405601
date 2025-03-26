import clsx from "clsx";

interface PropsFieldLabel {
  label: string;
  children: React.ReactNode;
  valueClass?: string;
  labelClass?: string;
  type?: "vertical" | "horizontal";
}

export function FieldLabel(props: PropsFieldLabel) {
  return (
    <div
      className={clsx(
        "flex items-start gap-2",
        props.type === "vertical" && "flex-col",
      )}
    >
      <div className={props.labelClass}>{props.label} :</div>
      <div className={props.valueClass ?? "font-semibold"}>
        {props.children}
      </div>
    </div>
  );
}
