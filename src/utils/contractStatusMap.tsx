
export const contractStatus = [
    {
        label: "แบบร่าง",
        value: "draft",
    },
    {
        label: "อนุมัติ",
        value: "approved",
    },
];

export const getContractStatusMap = (value: string) => {
    return contractStatus.find((item) => item.value === value);
};
