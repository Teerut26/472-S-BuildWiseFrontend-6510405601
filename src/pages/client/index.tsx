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
import useGetClients from "@/hooks/queries/client/useGetClients";
import useDeleteClient from "@/hooks/mutates/client/useDeleteClient";
import { AxiosError } from "axios";
import { notifications } from "@mantine/notifications";
import Fuse from "fuse.js";

export default function ClientList() {
  const [opened, { open, close }] = useDisclosure(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const getClientsApi = useGetClients();
  const deleteClientApi = useDeleteClient();

  const fuse = new Fuse(getClientsApi.data?.data.clients ?? [], {
    keys: ["name", "email", "tel", "tax_id"],
    threshold: 0.1, // ลดค่า threshold ให้ใกล้เคียงกับการค้นหาตรงเป๊ะมากขึ้น
    distance: 5,
    // threshold: 0.3, // ค่าต่ำ = ตรงเป๊ะ, ค่าสูง = ค้นหาแบบ fuzzy มากขึ้น
  });

  // ใช้ Fuse ค้นหา ถ้ามี searchKeyword
  const filteredClients =
    searchKeyword.trim() === ""
      ? (getClientsApi.data?.data.clients ?? [])
      : fuse.search(searchKeyword).map((result) => result.item);

  type ColumnType = NonNullable<
    typeof getClientsApi.data
  >["data"]["clients"] extends (infer T)[] | null | undefined
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
        deleteClientApi.mutate(
          { client_id: record.id! },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "ลบข้อมูลสําเร็จ",
                color: "green",
                loading: false,
              });
              getClientsApi.refetch();
            },
            onError: (error) => {
              if (error instanceof AxiosError) {
                console.log(error);
                notifications.show({
                  title: "เกิดข้อผิดพลาด",
                  message: error.response?.data.error,
                  color: "red",
                  loading: false,
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
            รายการลูกค้า
          </Text>
        </div>

        <div className="flex gap-3">
          <TextInput
            placeholder="ค้นหาด้วย ชื่อลูกค้า, อีเมล, เบอร์โทร หรือ เลขประจำตัวผู้เสียภาษี"
            rightSection={<IconSearch size={15} />}
            className="flex-1"
            onChange={(e) => setSearchKeyword(e.target.value)}
            value={searchKeyword}
            size="md"
          />
          <Link href="/client/create">
            <Button size="md" leftSection={<IconPlus size={15} />}>
              สร้างลูกค้า
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          {getClientsApi.isLoading ? (
            <Skeleton height={20} width={200} mt={6} />
          ) : (
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                รายการลูกค้าทั้งหมด{" "}
                <NumberFormatter
                  value={filteredClients.length}
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
          records={filteredClients}
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
              accessor: "tax_id",
              title: "เลขประจำตัวผู้เสียภาษี",
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
                    <Link href={"/client/edit/" + record.id}>
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
