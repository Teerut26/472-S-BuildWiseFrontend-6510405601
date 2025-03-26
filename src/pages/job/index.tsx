import {
  ActionIcon,
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
import {
  IconDotsVertical,
  IconFilter,
  IconPencil,
  IconPlus,
  IconSearch,
  IconSortAscending,
  IconTrash,
} from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import React, { useState } from "react";
import Link from "next/link";
import { modals } from "@mantine/modals";
import { DeleteConfirmModalConfig } from "@/config/ConfirmModalConfig/ConfirmModalConfig";
import useGetJobs from "@/hooks/queries/job/useGetJobs";
import useDeleteJob from "@/hooks/mutates/job/useDeleteJob";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import Fuse from "fuse.js";

export default function Job() {
  const getJobsApi = useGetJobs();
  const deleteJob = useDeleteJob();

  const [searchKeyword, setSearchKeyword] = useState("");

  // ตั้งค่าตัวกรองการค้นหาของ Fuse.js
  const fuse = new Fuse(getJobsApi.data?.data.jobs ?? [], {
    keys: ["name", "description"],
    threshold: 0.3, // ค่าต่ำ = ตรงเป๊ะ, ค่าสูง = ค้นหาแบบ fuzzy มากขึ้น
  });

  // ใช้ Fuse ค้นหา ถ้ามี searchKeyword
  const filteredJobs =
    searchKeyword.trim() === ""
      ? (getJobsApi.data?.data.jobs ?? [])
      : fuse.search(searchKeyword).map((result) => result.item);

  type ColumnType = NonNullable<typeof getJobsApi.data>["data"]["jobs"] extends
    | (infer T)[]
    | null
    | undefined
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
        deleteJob.mutate(
          { job_id: record.job_id },
          {
            onSuccess: () => {
              notifications.show({
                title: "สําเร็จ",
                message: "ลบงานสําเร็จ",
                color: "green",
              });
              getJobsApi.refetch();
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
            รายการงาน
          </Text>
        </div>

        <div className="flex gap-3">
          <TextInput
            placeholder="ค้นหาด้วย ชื่องาน หรือ รายละเอียด"
            rightSection={<IconSearch size={15} />}
            className="flex-1"
            onChange={(e) => setSearchKeyword(e.target.value)}
            value={searchKeyword}
            size="md"
          />
          <Link href="/job/create">
            <Button size="md" leftSection={<IconPlus size={15} />}>
              เพิ่มงาน
            </Button>
          </Link>
        </div>
        <div className="flex items-center justify-between">
          {getJobsApi.isLoading ? (
            <Skeleton height={20} width={200} mt={6} />
          ) : (
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                รายการงานทั้งหมด{" "}
                <NumberFormatter
                  value={filteredJobs.length}
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
          records={filteredJobs}
          columns={[
            {
              accessor: "name",
              title: "ชื่องาน",
            },
            {
              accessor: "description",
              title: "รายละเอียดงาน",
            },
            {
              accessor: "unit",
              title: "หน่วยของงาน",
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
                    <Link href={"/job/edit/" + record.job_id}>
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
