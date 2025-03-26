import { OpenConfirmModal } from "node_modules/@mantine/modals/lib/context";

export const DeleteConfirmModalConfig: OpenConfirmModal = {
  title: "ยืนยันการลบ",
  confirmProps: { color: "red" },
  labels: {
    confirm: "ลบ",
    cancel: "ยกเลิก",
  },
};
