import {
  IconLogout,
  IconLogin2,
  IconBriefcase,
  IconFileDescription,
  IconBox,
  IconUser,
  type IconProps,
  type Icon,
  IconTruck,
  IconBuilding,
} from "@tabler/icons-react";
import classes from "./Menu.module.css";
import clsx from "clsx";
import { Button, Card, NavLink } from "@mantine/core";
import { signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { type ForwardRefExoticComponent, type RefAttributes } from "react";

type MenuList = {
  link?: string;
  label: string;
  icon?: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
  children?: MenuList[];
};

const menuList: MenuList[] = [
  { link: "/project", label: "โครงการ", icon: IconBriefcase },
  { link: "/client", label: "ลูกค้า", icon: IconUser },
  {
    link: "/supplier",
    label: "ซัพพลายเออร์",
    icon: IconTruck,
  },
  {
    link: "/job",
    label: "งาน",
    icon: IconBriefcase,
  },
  {
    link: "/material",
    label: "วัสดุ",
    icon: IconBox,
  },
  {
    link: "/company",
    label: "บริษัท", 
    icon: IconBuilding,
  },
];

export function Menu() {
  const pathname = usePathname();
  const navigate = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const isCurrentPath = (link: string) => {
    return pathname.startsWith(link) || pathname === link;
  };

  const links = menuList.map((item) => (
    <NavLink
      px={20}
      href={item.link}
      key={item.link}
      onClick={(e) => {
        e.preventDefault();
        if (item.link) {
          navigate.push(item.link);
        }
      }}
      active={isCurrentPath(item.link ?? "")}
      label={item.label}
      leftSection={item.icon ? <item.icon stroke={1.5} /> : undefined}
    >
      {item.children
        ? item.children.map((child) => (
            <NavLink
              active={isCurrentPath(child.link ?? "")}
              label={child.label}
              href={child.link}
              onClick={(e) => {
                e.preventDefault();
                if (child.link) {
                  navigate.push(child.link);
                }
              }}
              key={child.link}
              leftSection={child.icon ? <child.icon stroke={1.5} /> : undefined}
            />
          ))
        : null}
    </NavLink>
  ));

  return (
    <nav>
      {sessionStatus === "authenticated" && (
        <div className={clsx("mt-3 flex flex-col")}>{links}</div>
      )}

      {sessionStatus === "authenticated" ? (
        <div className="mt-5">
          <NavLink label={session.user.email} px={20} />
          <NavLink
            onClick={() => {
              void signOut();
            }}
            leftSection={<IconLogout stroke={1.5} />}
            label={"ออกจากระบบ"}
            color="red"
            variant="subtle"
            px={20}
          />

          {/* <Button
            justify="start"
            variant={"subtle"}
            color="red"
            fullWidth
            onClick={() => {
              void signOut();
            }}
            leftSection={<IconLogout stroke={1.5} />}
          >
            ออกจากระบบ
          </Button> */}
        </div>
      ) : (
        <div className={classes.footer}>
          <Link href="/auth/sign-in">
            <Button
              onClick={() => navigate.push("/auth/sign-in")}
              justify="start"
              variant={"subtle"}
              fullWidth
              leftSection={<IconLogin2 stroke={1.5} />}
            >
              เข้่าสู่ระบบ
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
