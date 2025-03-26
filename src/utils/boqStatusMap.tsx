
export const boqStatus = [
  {
    label: "แบบร่าง",
    value: "draft",
  },
  {
    label: "อนุมัติ",
    value: "approved",
  },
];

export const getBoqStatusMap = (value: string) => {
  return boqStatus.find((item) => item.value === value);
};
