
export const invoiceStatus = [
    {
        label: "แบบร่าง",
        value: "draft",
    },
    {
        label: "อนุมัติ",
        value: "approved",
    },
];

export const getInvoiceStatusMap = (value: string) => {
    return invoiceStatus.find((item) => item.value === value);
};
