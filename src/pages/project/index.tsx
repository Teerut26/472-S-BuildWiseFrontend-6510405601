import Fuse from 'fuse.js';
import _ from 'lodash';
import Link from 'next/link';
import React, { useState } from 'react';

import ProjectCard from '@/components/Project/ProjectCard/ProjectCard';
import useGetProjects from '@/hooks/queries/project/useGetProjects';
import { type Project } from '@/services/project/getProjects.service';
import { getProjectStatusMap, projectStatus } from '@/utils/projectStatusMap';
import {
    ActionIcon, Badge, Button, Drawer, Group, MultiSelect, NumberFormatter, Skeleton, Text,
    TextInput
} from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import {
    IconFilter, IconPlus, IconSearch, IconSortAscending, IconSortDescending
} from '@tabler/icons-react';

export default function Index() {
    const [searchKeyword, setSearchKeyword] = useState("");

    const [projectSort, setProjectSort] = useLocalStorage<"asc" | "desc">({
        key: "projectSort",
        defaultValue: "asc",
    });

    const [projectSortStatus, setProjectSortStatus] = useLocalStorage<string[]>({
        key: "projectSortStatus",
        defaultValue: [],
    });

    const getProjectsApi = useGetProjects();
    const [opened, { open, close }] = useDisclosure(false);

    const projectFiltered = () => {
        let projectsFilterResult: Project[] = []
        // 1. ใช้ lodash ในการเรียงลำดับโครงการตามวันที่สร้างโครงการ
        projectsFilterResult = _.orderBy(getProjectsApi.data?.data.projects, o => o.created_at, projectSort)
        // 2. กรองโครงการตามสถานะโครงการที่เลือก
        if (projectSortStatus.length > 0) {
            projectsFilterResult = _.orderBy(getProjectsApi.data?.data.projects, o => o.created_at, projectSort).filter((project) => {
                return projectSortStatus.includes(project.status);
            })
        }
        // 3. ค้นหาโครงการโดยใช้ Fuse.js
        const fuse = new Fuse(projectsFilterResult, {
            keys: [
                "name",
                "description"
            ]
        })

        if (searchKeyword.length === 0) {
            return projectsFilterResult
        }

        return fuse.search(searchKeyword).map(result => result.item);
    }

    return (
        <>
            <Drawer
                opened={opened}
                position="right"
                onClose={close}
                title={<Text size="xl" fw={700}>การค้นหาขั้นสูง</Text>}
            >
                <div className="flex flex-col gap-3">
                    <MultiSelect
                        label="สถานะโครงการ"
                        placeholder="เลือกสถานะโครงการ"
                        data={projectStatus.map((status) => ({
                            value: status.value,
                            label: status.label,
                        }))}
                        size='md'
                        value={projectSortStatus}
                        onChange={setProjectSortStatus}
                        className="w-full"
                        hidePickedOptions
                        clearable
                        renderOption={({ option }) => {
                            return (
                                <div className="flex items-center gap-1">
                                    {getProjectStatusMap(option.value)?.icon}
                                    <Text c="dimmed" size="xs">
                                        {getProjectStatusMap(option.value)?.label}
                                    </Text>
                                </div>
                            );
                        }}
                        searchable
                    />

                </div>
            </Drawer>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between">
                    <Text size="xl" fw={700}>
                        รายการโครงการ
                    </Text>

                </div>
                <div className="grid grid-cols-3 gap-3">
                    <TextInput
                        placeholder="ค้นหาด้วย ชื่อโครงการ หรือ รายละเอียด"
                        rightSection={<IconSearch size={15} />}
                        className="flex-1 col-span-2"
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        value={searchKeyword}
                        size='md'
                    />
                    <div className="flex gap-3">
                        <div className="relative w-full">
                            {projectSortStatus.length > 0 && <Badge className="absolute z-10 -top-[10px] -right-[10px]" color="red">{projectSortStatus.length}</Badge>}
                            <Button
                                leftSection={<IconFilter size={15} />}
                                onClick={open}
                                fullWidth
                                variant="light"
                                size='md'
                            >
                                ค้นหาขั้นสูง
                            </Button>
                        </div>
                        <Link href="/project/create">
                            <Button size='md' leftSection={<IconPlus size={15} />}>สร้างโครงการ</Button>
                        </Link>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    {getProjectsApi.isLoading ? <Skeleton height={20} width={200} mt={6} /> : <Group gap="xs">
                        <Text size="sm" c="dimmed">
                            รายการโครงการทั้งหมด <NumberFormatter value={projectFiltered().length} thousandSeparator /> รายการ
                        </Text>
                        <Group gap={8}>
                            {projectSortStatus.map((status) => (
                                <Badge variant='light' key={status} color={getProjectStatusMap(status)?.color}>{getProjectStatusMap(status)?.label}</Badge>
                            ))}
                        </Group>
                    </Group>}
                    <Group gap="sm">
                        {projectSort === "asc" ? <Text size='xs' c="dimmed">เรียงลำดับวันที่สร้างเก่าสุด</Text> : <Text size='xs' c="dimmed">เรียงลำดับวันที่สร้างล่าสุด</Text>}
                        <ActionIcon color="" variant="light" onClick={() => setProjectSort(projectSort === "asc" ? "desc" : "asc")}>
                            {projectSort === "asc" ? <IconSortAscending size={25} /> : <IconSortDescending size={25} />}
                        </ActionIcon>
                    </Group>
                </div>
                {
                    getProjectsApi.isLoading ? (
                        <div className="grid grid-cols-3 gap-3">
                            {new Array(20).fill(0).map((_, index) => (
                                <Skeleton key={index} height={121} mt={6} />
                            ))}
                        </div>
                    ) : <div className="grid grid-cols-3 gap-3">
                        {projectFiltered()?.map((project, index) => (
                            <ProjectCard project={project} key={index} />
                        ))}
                    </div>
                }

            </div>
        </>
    );
}
