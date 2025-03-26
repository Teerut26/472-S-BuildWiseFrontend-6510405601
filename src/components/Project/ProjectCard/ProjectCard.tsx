import { type Project } from "@/services/project/getProjects.service";
import { getProjectStatusMap } from "@/utils/projectStatusMap";
import {
    Badge,
  Card,
  Text,
} from "@mantine/core";
import {
  IconCalendar,
} from "@tabler/icons-react";
import { format } from "date-fns";
import Link from "next/link";

interface Props {
  project: Project;
}

export default function ProjectCard(props: Props) {
  return (
    <Card withBorder className="flex flex-col gap-3">
      <div className="flex flex-col grow">
        <div className="flex justify-between">
          <Link href={"/project/" + props.project.id}>
            <Text size="md" fw={500}>
              {props.project.name}
            </Text>
          </Link>
        </div>
        <Text c="dimmed" size="xs" fw={500} lineClamp={2}>
          {props.project.description}
        </Text>
      </div>
      <div className="flex flex-col">
        {/* <div className="flex items-center gap-1">
          {getProjectStatusMap(props.project.status)?.icon}
          <Text c="dimmed" size="xs">
            {getProjectStatusMap(props.project.status)?.label}
          </Text>
        </div> */}
         <Badge variant='light' color={getProjectStatusMap(props.project.status)?.color} leftSection={getProjectStatusMap(props.project.status)?.icon}>{getProjectStatusMap(props.project.status)?.label}</Badge>
        {/* <div className="flex items-center gap-1">
          <IconCalendar className="text-gray-400" size={15} />
          <Text c="dimmed" size="xs">
            {format(props.project.updated_at, "dd/MMM/yyyy HH:mm")}
          </Text>
        </div> */}
      </div>
    </Card>
  );
}
