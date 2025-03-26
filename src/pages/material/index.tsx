import {
  Badge,
  Button,
  Group,
  Menu,
  NumberFormatter,
  rem,
  Skeleton,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDotsVertical,
  IconPencil,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import React, { useState } from "react";
import Link from "next/link";
import { modals } from "@mantine/modals";
import { DeleteConfirmModalConfig } from "@/config/ConfirmModalConfig/ConfirmModalConfig";
import useGetMaterials from "@/hooks/queries/material/useGetMaterials";
import useDeleteMaterial from "@/hooks/mutates/material/useDeleteMaterial";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import Fuse from "fuse.js";

export default function Material() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const getMaterials = useGetMaterials();
  const deleteMaterial = useDeleteMaterial();

  const fuse = new Fuse(getMaterials.data?.data.materials ?? [], {
    keys: ["name", "unit"],
    threshold: 0.1, // ลดค่า threshold ให้ใกล้เคียงกับการค้นหาตรงเป๊ะมากขึ้น
    distance: 5,
    // threshold: 0.3, // ค่าต่ำ = ตรงเป๊ะ, ค่าสูง = ค้นหาแบบ fuzzy มากขึ้น
  });

  // ใช้ Fuse ค้นหา ถ้ามี searchKeyword
  const filteredMaterials =
    searchKeyword.trim() === ""
      ? (getMaterials.data?.data.materials ?? [])
      : fuse.search(searchKeyword).map((result) => result.item);

  type ColumnType = NonNullable<
    typeof getMaterials.data
  >["data"]["materials"] extends (infer T)[] | null | undefined
    ? T
    : never;

  const onDelete = (record: ColumnType) => {
    modals.openConfirmModal({
      ...DeleteConfirmModalConfig,
      children: (
        <Text size="sm">
          คุณแน่ใจหรือไม่ว่าต้องการลบ <Badge>{record.name}</Badge>
        </Text>
      ),
      onConfirm: () => {
        deleteMaterial.mutate(
          { material_id: record.material_id! },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "ลบวัสดุสําเร็จ",
                color: "green",
              });
              getMaterials.refetch();
            },
            onError: (error) => {
              if (error instanceof AxiosError) {
                notifications.show({
                  title: "เกิดข้อผิดพลาด",
                  message: error.response?.data.error,
                  color: "red",
                });
              }
            },
          },
        );
      },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Text size="xl" fw={700}>
            รายการวัสดุ
          </Text>
        </div>
        <div className="flex gap-3">
          <TextInput
            placeholder="ค้นหาด้วย ชื่อ หรือ หน่วยของวัสดุ"
            rightSection={<IconSearch size={15} />}
            className="flex-1"
            onChange={(e) => setSearchKeyword(e.target.value)}
            value={searchKeyword}
            size="md"
          />
          <Link href="/material/create">
            <Button size="md" leftSection={<IconPlus size={15} />}>
              เพิ่มวัสดุ
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          {getMaterials.isLoading ? (
            <Skeleton height={20} width={200} mt={6} />
          ) : (
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                รายการวัสดุทั้งหมด{" "}
                <NumberFormatter
                  value={filteredMaterials.length}
                  thousandSeparator
                />{" "}
                รายการ
              </Text>
            </Group>
          )}
          <Group gap="sm">
            {/* {projectSort === "asc" ? <Text size='xs' c="dimmed">เรียงลำดับวันที่สร้างเก่าสุด</Text> : <Text size='xs' c="dimmed">เรียงลำดับวันที่สร้างล่าสุด</Text>}
                                <ActionIcon color="" variant="light" onClick={() => setProjectSort(projectSort === "asc" ? "desc" : "asc")}>
                                    {projectSort === "asc" ? <IconSortAscending size={25} /> : <IconSortDescending size={25} />}
                                </ActionIcon> */}
          </Group>
        </div>
        <DataTable
          records={filteredMaterials}
          columns={[
            {
              accessor: "name",
              title: "ชื่อ",
            },
            {
              accessor: "unit",
              title: "หน่วยของวัสดุ",
              render: (record) => <Badge>{record.unit}</Badge>,
            },
            {
              accessor: "id",
              title: "ดำเนินการ",
              textAlign: "center",
              render: (record) => (
                <Menu
                  shadow="md"
                  width={200}
                  position="bottom-end"
                  trigger="hover"
                  withArrow
                >
                  <Menu.Target>
                    <UnstyledButton variant="transparent">
                      <IconDotsVertical size={15} color="gray" />
                    </UnstyledButton>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Label>การดำเนินการ</Menu.Label>
                    <Link href={"/material/edit/" + record.material_id}>
                      <Menu.Item
                        leftSection={
                          <IconPencil
                            style={{ width: rem(14), height: rem(14) }}
                          />
                        }
                      >
                        แก้ไข
                      </Menu.Item>
                    </Link>
                    <Menu.Item
                      leftSection={
                        <IconTrash
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      }
                      onClick={() => onDelete(record)}
                      color="red"
                    >
                      ลบ
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
