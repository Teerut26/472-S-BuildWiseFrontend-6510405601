import {
  Badge,
  Button,
  Drawer,
  Group,
  Menu,
  MultiSelect,
  NumberFormatter,
  rem,
  Skeleton,
  Text,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { format } from "date-fns";
import {
  IconDotsVertical,
  IconEdit,
  IconFilter,
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
import useGetSuppliers from "@/hooks/queries/supplier/useGetSuppliers";
import useDeleteSupplier from "@/hooks/mutates/supplier/useDeleteSupplier";
import { AxiosError } from "axios";
import Fuse from "fuse.js";

export default function SupplierList() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const GetSuppliersApi = useGetSuppliers();
  const deleteSupplierApi = useDeleteSupplier();

  const fuse = new Fuse(GetSuppliersApi.data?.data.suppliers ?? [], {
    keys: ["name", "email", "tel"],
    threshold: 0.1, // ลดค่า threshold ให้ใกล้เคียงกับการค้นหาตรงเป๊ะมากขึ้น
    distance: 5,
    // threshold: 0.3, // ค่าต่ำ = ตรงเป๊ะ, ค่าสูง = ค้นหาแบบ fuzzy มากขึ้น
  });
  const filteredSuppliers =
    searchKeyword.trim() === ""
      ? (GetSuppliersApi.data?.data.suppliers ?? [])
      : fuse.search(searchKeyword).map((result) => result.item);

  type ColumnType = NonNullable<
    typeof GetSuppliersApi.data
  >["data"]["suppliers"] extends (infer T)[] | null | undefined
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
        deleteSupplierApi.mutate(
          { supplier_id: record.id! },
          {
            onSuccess: () => {
              GetSuppliersApi.refetch();
            },
          },
        );
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
        }
      },
    });
  };

  return (
    <>
      <Drawer
        opened={opened}
        position="right"
        onClose={close}
        title="การค้นหาขั้นสูง"
      >
        <div className="flex flex-col gap-3">
          <MultiSelect
            searchable
            clearable
            label="สถานะ BOQ"
            placeholder="สถานะ BOQ"
            data={["แบบร่าง", "ยังไม่ได้ทำ", "ทำแล้ว"]}
          />
        </div>
      </Drawer>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between">
          <Text size="xl" fw={700}>
            รายการซัพพลายเออร์
          </Text>
        </div>

        <div className="flex gap-3">
          <TextInput
            placeholder="ค้นหาด้วย ชื่อซัพพลายเออร์, อีเมล หรือ เบอร์โทร"
            rightSection={<IconSearch size={15} />}
            className="flex-1"
            onChange={(e) => setSearchKeyword(e.target.value)}
            value={searchKeyword}
            size="md"
          />
          <Link href="/supplier/create">
            <Button size="md" leftSection={<IconPlus size={15} />}>
              สร้างซัพพลายเออร์
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          {GetSuppliersApi.isLoading ? (
            <Skeleton height={20} width={200} mt={6} />
          ) : (
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                รายการซัพพลายเออร์ทั้งหมด{" "}
                <NumberFormatter
                  value={filteredSuppliers.length}
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
          records={filteredSuppliers}
          columns={[
            {
              accessor: "name",
              title: "ชื่อ",
            },
            {
              accessor: "email",
              title: "อีเมล",
            },
            {
              accessor: "tel",
              title: "เบอร์โทรติดต่อ",
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
                    <Link href={"/supplier/edit/" + record.id}>
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
