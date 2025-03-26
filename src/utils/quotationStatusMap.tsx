export const quotationStatus = [
  {
    label: "แบบร่าง",
    value: "draft",
  },
  {
    label: "อนุมัติ",
    value: "approved",
  },
];

export const getQuotationStatusMap = (value: string) => {
  return quotationStatus.find((item) => item.value === value);
};
